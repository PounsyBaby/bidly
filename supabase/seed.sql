-- Public demo auctions for Bidly.
-- Run this after schema.sql if you want Supabase to contain sample auctions.
-- These rows do not require a seller account because seller_id is nullable.

insert into auction_items (
  title,
  description,
  image_url,
  starting_price,
  current_price,
  highest_bidder_id,
  seller_id,
  seller_name,
  ends_at,
  status
) values
(
  'Casque audio Bluetooth',
  'Casque sans fil en bon etat, avec reduction de bruit active.',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900',
  25,
  45,
  null,
  null,
  'Camille',
  now() + interval '10 days',
  'active'
),
(
  'Montre connectee',
  'Montre connectee simple, ideale pour le sport et les notifications.',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900',
  40,
  60,
  null,
  null,
  'Nora',
  now() + interval '14 days',
  'active'
),
(
  'Sac a dos',
  'Sac a dos noir avec compartiment ordinateur.',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900',
  15,
  15,
  null,
  null,
  'Yanis',
  now() + interval '20 days',
  'active'
),
(
  'Clavier mecanique',
  'Clavier mecanique compact avec touches retroeclairees.',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900',
  30,
  55,
  null,
  null,
  'Lina',
  now() - interval '5 days',
  'active'
),
(
  'Jeu video',
  'Jeu d''aventure recent, boite en tres bon etat.',
  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=900',
  20,
  32,
  null,
  null,
  'Mehdi',
  now() + interval '25 days',
  'active'
);
