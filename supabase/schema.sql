-- Bidly schema with Supabase Auth and Row Level Security.
-- Run this file in the Supabase SQL Editor on a clean project.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;

create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create table if not exists auction_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  starting_price numeric(10, 2) not null check (starting_price >= 0),
  current_price numeric(10, 2) not null check (current_price >= starting_price),
  highest_bidder_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  seller_name text,
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'ended', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  auction_item_id uuid not null references auction_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  auction_item_id uuid not null references auction_items(id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists auction_items_highest_bidder_id_idx on auction_items(highest_bidder_id);
create index if not exists auction_items_seller_id_idx on auction_items(seller_id);
create index if not exists bids_auction_item_id_idx on bids(auction_item_id);
create index if not exists bids_user_id_idx on bids(user_id);
create index if not exists notifications_user_id_idx on notifications(user_id);

alter table profiles enable row level security;
alter table auction_items enable row level security;
alter table bids enable row level security;
alter table notifications enable row level security;

drop policy if exists "Users can read profiles" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Anyone can read active auction items" on auction_items;
drop policy if exists "Authenticated users can create auction items" on auction_items;
drop policy if exists "Sellers can update their own auction items" on auction_items;
drop policy if exists "Sellers can delete their own auction items" on auction_items;
drop policy if exists "Authenticated users can read bids" on bids;
drop policy if exists "Authenticated users can insert their own bids" on bids;
drop policy if exists "Users can read their own notifications" on notifications;
drop policy if exists "Authenticated users can create notifications" on notifications;
drop policy if exists "Users can update their own notifications" on notifications;

create policy "Users can read profiles"
on profiles
for select
to authenticated
using (true);

create policy "Users can insert their own profile"
on profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update their own profile"
on profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Anyone can read active auction items"
on auction_items
for select
to anon, authenticated
using (status = 'active');

create policy "Authenticated users can create auction items"
on auction_items
for insert
to authenticated
with check (seller_id = auth.uid());

create policy "Sellers can update their own auction items"
on auction_items
for update
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "Sellers can delete their own auction items"
on auction_items
for delete
to authenticated
using (seller_id = auth.uid());

create policy "Authenticated users can read bids"
on bids
for select
to authenticated
using (true);

create policy "Authenticated users can insert their own bids"
on bids
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can read their own notifications"
on notifications
for select
to authenticated
using (user_id = auth.uid());

create policy "Authenticated users can create notifications"
on notifications
for insert
to authenticated
with check (true);

create policy "Users can update their own notifications"
on notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace function public.place_bid(
  p_auction_item_id uuid,
  p_amount numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  auction_record public.auction_items%rowtype;
  bidder_id uuid;
  previous_bidder_id uuid;
begin
  bidder_id := auth.uid();

  if bidder_id is null then
    raise exception 'Connectez-vous pour placer une enchère.';
  end if;

  select *
  into auction_record
  from public.auction_items
  where id = p_auction_item_id
  for update;

  if not found then
    raise exception 'Enchère introuvable.';
  end if;

  if auction_record.status <> 'active' or auction_record.ends_at <= now() then
    raise exception 'Cette enchère est terminée.';
  end if;

  if auction_record.seller_id = bidder_id then
    raise exception 'Vous ne pouvez pas enchérir sur votre propre vente.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Le montant doit être un nombre valide.';
  end if;

  if p_amount <= auction_record.current_price then
    raise exception 'Le montant doit être supérieur au prix actuel.';
  end if;

  if auction_record.highest_bidder_id is null and p_amount < auction_record.starting_price then
    raise exception 'Le premier montant doit être au moins égal au prix de départ.';
  end if;

  previous_bidder_id := auction_record.highest_bidder_id;

  insert into public.bids (auction_item_id, user_id, amount)
  values (p_auction_item_id, bidder_id, p_amount);

  update public.auction_items
  set
    current_price = p_amount,
    highest_bidder_id = bidder_id
  where id = p_auction_item_id;

  if previous_bidder_id is not null and previous_bidder_id <> bidder_id then
    insert into public.notifications (user_id, auction_item_id, message)
    values (
      previous_bidder_id,
      p_auction_item_id,
      'Quelqu''un a surenchéri sur '
        || auction_record.title
        || '. Nouvelle enchère : '
        || replace(to_char(p_amount, 'FM999999990.00'), '.', ',')
        || ' €'
    );
  end if;
end;
$$;

grant execute on function public.place_bid(uuid, numeric) to authenticated;

insert into profiles (id, display_name)
select
  id,
  coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;
