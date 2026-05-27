# AGENTS.md

# 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.
Before implementing anything:

- State your assumptions explicitly.
- If something is unclear, stop and ask before changing code.
- If multiple interpretations exist, present them instead of silently choosing.
- If a simpler approach exists, say so.
- Push back when a request would make the project too complex, too fragile, or unrealistic for a school project.
- Do not invent features, screens, database fields, or architecture decisions that were not requested.
  The goal is not to build the most advanced auction app possible.
  The goal is to build a clean, understandable, defensible mobile project that matches the school requirements.

---

# 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No complex architecture unless clearly useful.
- No over-engineering.
- No generic systems for things used only once.
- No “future-proofing” unless explicitly requested.
- Keep TypeScript types simple and readable.
- Prefer explicit code over clever code.
  Ask yourself:
  > Would a student be able to explain this code clearly during a project defense?
  > If the answer is no, simplify.
  > If a solution can be done in 50 lines, do not write 200.

---

# 3. Surgical Changes

Touch only what you must. Clean up only your own mess.
When editing existing code:

- Do not refactor unrelated files.
- Do not rename things unless required.
- Do not change formatting across the project.
- Match the existing style, even if you would do it differently.
- Do not “improve” adjacent code unless it directly supports the requested task.
- If you notice unrelated dead code or bad structure, mention it instead of changing it.
  When your own changes create unused imports, variables, functions, or files:
- Remove them.
- Do not leave broken or unused code behind.
  Every changed line must directly support the user request.

---

# 4. Goal-Driven Execution

Transform every task into verifiable goals.
For multi-step tasks, use this format before coding:

```txt
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Examples:

* “Add keyword search” → add a search input, filter auction items by title, verify results update correctly.
* “Add notifications when outbid” → detect higher bid, create notification, verify the previous highest bidder is notified.
* “Fix bid validation” → reproduce invalid bid case, fix validation, verify invalid bids are blocked.

Do not stop at “it should work”.
Define what “working” means.

⸻

5. Project Context — Bidly

Project Name

Bidly

Project Type

Mobile application for simple auctions.

Main Objective

Bidly is a mobile app allowing users to:

* browse items listed for auction,
* view item details,
* place bids,
* follow auctions until they end,
* track auctions they participate in,
* receive notifications when someone outbids them.

This is a school project. The code must remain understandable, realistic, and explainable during an oral defense.

⸻

6. Tech Stack

Main Stack

* React Native
* Expo
* TypeScript

All code must be written in TypeScript.

No JavaScript files unless absolutely required by tooling.

Data

The project currently starts with:

* local demo data for the first working prototype.

The final project may use:

* Supabase, if remote shared data is needed for the submitted version.

The data choice must remain simple and justifiable.

Preferred final choice

For the final version, Supabase is preferred if there is enough time because:

* it is easier to demonstrate real user interactions,
* it supports remote data,
* it is more realistic for auctions,
* it can support multiple users bidding on the same item,
* it simplifies future real-time behavior,
* it is easier to justify for notifications when someone outbids another user.

Do not connect Supabase before the local demo flow is stable.

⸻

7. Project Scope

Bidly is not eBay.
Bidly is not Vinted.
Bidly is not a marketplace with payments, shipping, disputes, ratings, or professional sellers.

The app must stay focused on simple auctions.

In Scope

The MVP includes:

* Auction item list
* Auction item detail screen
* Bid placement
* Bid validation
* Keyword search
* Auction tracking
* Notifications when someone outbids the current highest bidder
* Basic user identification
* Auction end handling
* Clear navigation between screens

Out of Scope

Do not implement these unless explicitly requested:

* Online payments
* Delivery system
* Seller ratings
* Chat between users
* Admin dashboard
* Complex moderation
* Stripe integration
* Push notifications requiring production credentials
* Real-time bidding with advanced conflict handling
* Social login
* Image upload unless specifically requested
* Multi-language support
* Complex profile management
* Watchlists with advanced filters
* Favorites unless requested
* Categories unless requested
* Dark mode unless requested

⸻

8. Core Features

8.1 Auction List

Users must be able to view a list of auction items.

Each item should display at minimum:

* item name/title,
* image if available,
* current highest bid,
* auction end time or remaining time,
* basic status.

The list must be simple and readable.

Avoid complex card animations or heavy UI effects.

⸻

8.2 Keyword Search

Users must be able to search auctions by keyword.

The search should apply to:

* item title/name,
* optionally item description if already available.

Search must be simple.

Preferred behavior:

* search input at the top of the auction list,
* filter results as the user types,
* case-insensitive matching.

Do not add advanced filters unless requested.

⸻

8.3 Auction Detail

Users must be able to open an auction item and see more details.

The detail screen should show:

* item name/title,
* image if available,
* description,
* starting price,
* current highest bid,
* auction end date/time,
* seller name or simple seller label if available,
* bid input,
* button to place a bid.

Keep the screen clean.

⸻

8.4 Place a Bid

Users must be able to place a bid on an active auction.

Bid validation rules:

* bid must be a valid number,
* bid must be greater than the current highest bid,
* bid must be greater than or equal to the starting price if there are no previous bids,
* bid must not be accepted if the auction has ended,
* bid must not be accepted if the item is inactive or unavailable.

When a bid is accepted:

* create the bid record,
* update the current highest bid if needed,
* notify the previous highest bidder if someone outbids them,
* show success feedback to the user.

When a bid is rejected:

* show a clear error message,
* do not create a bid record.

⸻

8.5 Notifications When Outbid

Users must receive a notification when someone places a higher bid than theirs.

For this school project, “notification” can mean an in-app notification.

Do not implement native push notifications unless explicitly requested.

Preferred implementation:

* store notifications in the database,
* show them in a simple notifications screen or notification area,
* mark notifications as read if needed.

Notification content should be simple:

Quelqu’un a surenchéri sur [item name].
Nouvelle enchère : [amount] €

A notification should be created only for the previous highest bidder, not for every bidder.

If the same user outbids themselves, do not create an outbid notification.

⸻

8.6 Auction Tracking

Users should be able to track auctions they participate in.

This can be implemented as:

* a “My Bids” screen,
* or a “Tracked Auctions” screen.

It should show auctions where the current user has placed at least one bid.

Each tracked auction should show:

* item name,
* current highest bid,
* user’s latest bid,
* whether the user is currently winning,
* whether the auction is still active or ended.

Keep the logic simple and easy to explain.

⸻

8.7 Auction End Handling

Auctions must have an end date/time.

The app should prevent new bids after the auction ends.

Status can be calculated from ends_at.

Do not create a complex background job system unless explicitly requested.

Preferred simple approach:

* if ends_at is in the past, the auction is considered ended,
* UI disables the bid button,
* bid validation also blocks the bid.

The winner is the user with the highest valid bid when the auction ends.

⸻

9. User Model

This project does not need complex authentication unless requested.

Acceptable simple approaches:

Option A — Supabase Auth

Use Supabase email/password authentication.

Pros:

* realistic,
* clean user separation,
* easier to identify bidders.

Cons:

* more setup,
* more screens.

Option B — Local Anonymous User

Generate a simple local user identity.

Pros:

* simpler,
* faster for school demo.

Cons:

* less realistic,
* harder to justify multi-device use.

Default Choice

Use Supabase Auth if the app already has login/register screens or if authentication is required by the teacher.

Use a simplified local user identity only if the project scope must stay very small.

Do not implement both unless explicitly requested.

⸻

10. Supabase Schema

If Supabase is used, keep the schema simple.

users / profiles

If Supabase Auth is used, Supabase already manages auth.users.

Create a profiles table only if needed.

Field	Type	Role
id	uuid PK	Same as auth user id
display_name	text	Public name
created_at	timestamptz default now()	Creation date

⸻

auction_items

Field	Type	Role
id	uuid PK, default gen_random_uuid()	Item identifier
title	text, not null	Item title
description	text, nullable	Item description
image_url	text, nullable	Item image
starting_price	decimal(10,2), not null	Minimum first bid
current_price	decimal(10,2), not null	Current highest bid
seller_id	uuid, nullable	User who created the item
ends_at	timestamptz, not null	Auction end time
status	text, not null	active / ended / cancelled
created_at	timestamptz, default now()	Creation date

Notes:

* current_price should never be lower than starting_price.
* status should stay simple.
* Do not add payment/shipping fields.

⸻

bids

Field	Type	Role
id	uuid PK, default gen_random_uuid()	Bid identifier
auction_item_id	uuid FK, not null	Related auction item
user_id	uuid, not null	Bidder
amount	decimal(10,2), not null	Bid amount
created_at	timestamptz, default now()	Bid time

Rules:

* amount must be greater than the current highest bid.
* A bid must not be inserted if the auction has ended.
* The highest bid determines the current winner.

⸻

notifications

Field	Type	Role
id	uuid PK, default gen_random_uuid()	Notification identifier
user_id	uuid, not null	User receiving notification
auction_item_id	uuid FK, not null	Related auction
message	text, not null	Notification message
read	boolean, default false	Read status
created_at	timestamptz, default now()	Creation date

Used mainly for outbid notifications.

⸻

11. Navigation

Use simple navigation.

Recommended screens:

* Home / AuctionListScreen
* AuctionDetailScreen
* MyBidsScreen
* NotificationsScreen
* CreateAuctionScreen only if item creation is required
* LoginScreen only if authentication is required
* RegisterScreen only if authentication is required

Do not create deeply nested navigation.

Do not add tabs and stacks unless useful.

For a small project, bottom tabs can be used for:

* Auctions
* My Bids
* Notifications

Keep navigation easy to explain.

⸻

12. Suggested Folder Structure

Keep the structure simple.

Recommended:

app/
  (tabs)/
    index.tsx
    my-bids.tsx
    notifications.tsx
  auction/
    [id].tsx
components/
  AuctionCard.tsx
context/
  AuctionContext.tsx
data/
  demoAuctions.ts
services/
  supabase.ts
  auctionsService.ts
  bidsService.ts
  notificationsService.ts
types/
  auction.ts
utils/
  formatPrice.ts
  formatDate.ts
  auctionStatus.ts

Rules:

* Do not create folders before they are needed.
* Do not create “helpers” or “shared” folders without clear purpose.
* Do not introduce Redux unless explicitly requested.
* React Context is acceptable for simple auth/user state.
* Local component state is preferred when state is not shared.

⸻

13. TypeScript Rules

Use TypeScript everywhere.

Preferred

type AuctionItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingPrice: number;
  currentPrice: number;
  endsAt: string;
  status: 'active' | 'ended' | 'cancelled';
};

Avoid

* unnecessary generics,
* complex mapped types,
* any,
* clever utility types,
* over-abstracted type systems.

Use unknown instead of any only when needed.

Do not silence TypeScript errors without explaining why.

⸻

14. UI Rules

The UI should be clean, simple, and mobile-friendly.

Use basic React Native components unless the project already uses a UI library.

UI Priorities

* readable text,
* clear buttons,
* clear feedback messages,
* simple forms,
* understandable layout.

Do not spend time on complex animations.

Do not add fancy visual effects unless requested.

Required Feedback

The app should clearly tell the user when:

* data is loading,
* an error happened,
* a bid was accepted,
* a bid was rejected,
* the auction has ended,
* the user has been outbid.

⸻

15. Data Loading Rules

When loading data:

* show a loading state,
* show an error state,
* show an empty state if there are no auctions.

Do not crash silently.

Do not leave blank screens.

Example empty state:

Aucune enchère disponible pour le moment.

Example error state:

Impossible de charger les enchères.

Keep messages short and understandable.

⸻

16. Bid Logic Rules

Bid logic is central to the project.

Do not scatter bid validation everywhere.

Preferred approach:

* UI performs basic validation for user feedback,
* service/database performs final validation before insertion.

Validation must check:

* auction exists,
* auction is active,
* auction has not ended,
* amount is a number,
* amount is greater than current price,
* user is identified.

When a bid is successfully placed:

1. Get current auction state.
2. Identify previous highest bidder if any.
3. Insert new bid.
4. Update auction current price.
5. Create outbid notification for previous highest bidder if needed.
6. Refresh UI.

Keep this flow readable.

⸻

17. Notification Logic Rules

Notifications are mainly for the outbid feature.

Do not create a complex notification system.

A notification should include:

* recipient user id,
* related auction item id,
* message,
* read status,
* creation date.

A notification is created when:

* User A is the current highest bidder.
* User B places a higher bid.
* User A receives an outbid notification.

A notification is not created when:

* there was no previous bidder,
* the same user increases their own bid,
* the new bid is invalid.

⸻

18. Realtime Rules

Realtime is optional unless requested.

If Supabase Realtime is used, keep it limited.

Acceptable realtime use:

* refresh auction item when a new bid is placed,
* refresh notifications,
* refresh auction list current prices.

Do not build a complex realtime architecture.

If realtime creates too much complexity, use manual refresh or reload after actions.

For school defense, reliability and clarity matter more than impressive but fragile realtime behavior.

⸻

19. Error Handling

Handle realistic errors only.

Good error handling:

* network/database error,
* invalid bid,
* ended auction,
* missing user,
* empty required fields.

Avoid excessive defensive programming for impossible scenarios.

Do not wrap every line in try/catch.

Service functions may use try/catch when calling the database.

UI should display simple error messages.

⸻

20. Forms

Forms must be simple.

For bid form:

* one numeric input,
* one submit button,
* validation message if invalid.

For auction creation, if implemented:

* title,
* description,
* starting price,
* image URL optional,
* end date/time.

Do not add complex image pickers unless requested.

Do not add advanced form libraries unless already installed.

⸻

21. Authentication

Do not implement authentication unless required.

If authentication is implemented:

* keep login/register simple,
* email/password only,
* no OAuth,
* no magic links unless requested,
* no roles unless required.

User identity is needed to know:

* who placed a bid,
* who receives notifications,
* which auctions appear in “My Bids”.

If no authentication is used, create a simple local user identity for demo purposes and clearly keep it simple.

⸻

22. Security and Supabase RLS

If Supabase is used, consider Row Level Security.

For a school prototype, keep policies understandable.

Do not create complex RLS policies that the user cannot explain.

Basic acceptable rules:

* users can read active auction items,
* authenticated users can insert bids,
* users can read their own notifications,
* users can update their own notifications as read.

Do not expose service role keys in the app.

Never place Supabase secret keys in client code.

Use only the public anon key in the mobile app.

⸻

23. Environment Variables

Supabase credentials should be stored in environment variables when possible.

Example:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

Rules:

* Do not hardcode secrets.
* Do not commit .env.
* Do not use service role keys in Expo client code.
* If environment setup is missing, explain exactly what needs to be added.

⸻

24. Testing and Verification

Before claiming a task is done, verify it.

At minimum, check:

* TypeScript has no obvious errors,
* app starts,
* changed screen renders,
* main user flow works,
* no unused imports were introduced.

If tests exist, run them.

If no tests exist, manually verify the relevant flow and explain what was checked.

For bid-related changes, verify:

* lower bid is rejected,
* equal bid is rejected,
* higher bid is accepted,
* bid after auction end is rejected,
* outbid notification is created correctly.

⸻

25. Commands

Use the package manager already present in the project.

Before running commands, inspect the project files.

Do not assume npm/yarn/pnpm.

Common commands may include:

npm install
npm run start
npm run lint
npm run typecheck
npx expo start

Only use commands that exist in package.json.

Do not add scripts unless necessary.

⸻

26. Dependencies

Do not install new dependencies unless clearly needed.

Before adding a package:

* check if the project already has a suitable tool,
* explain why the dependency is necessary,
* avoid heavy packages for simple features.

Do not add:

* Redux,
* Zustand,
* React Query,
* form libraries,
* animation libraries,
* date libraries,

unless the project already uses them or there is a strong reason.

For dates, prefer native Date utilities unless formatting becomes painful.

⸻

27. Styling

Use the styling approach already present in the project.

If no styling system exists, use React Native StyleSheet.

Do not introduce Tailwind, NativeWind, styled-components, or UI kits unless explicitly requested.

Keep styles local to components unless reused several times.

Prioritize clarity over aesthetics.

⸻

28. Naming Conventions

Use clear names.

Good:

AuctionListScreen
AuctionDetailScreen
placeBid
createOutbidNotification
getUserBids

Bad:

Handler
Manager
doThing
processData
useStuff

Names should explain the business meaning.

Avoid vague abstraction names.

⸻

29. Business Rules

The following business rules must stay consistent across the app:

* An auction item has a starting price.
* A bid must always be higher than the current price.
* A user cannot bid after the auction has ended.
* The highest bid wins.
* A user is notified when someone else places a higher bid.
* Search filters visible auction items by keyword.
* The app is a prototype, not a production marketplace.
* No payment is handled inside the app.
* No delivery is handled inside the app.

⸻

30. School Project Constraints

This project is made for school.

Therefore:

* code must be easy to explain,
* features must be demonstrable,
* architecture must be simple,
* avoid unnecessary complexity,
* avoid production-level systems that cannot be justified,
* keep the app realistic for the available time.

If a requested feature risks making the project too big, say it clearly and propose a smaller version.

Example:

Native push notifications would be too heavy for this project. A simple in-app notification system is enough to satisfy “notifications when someone outbids the user”.

⸻

31. Documentation

When adding an important feature, update documentation if documentation exists.

Useful documentation may include:

* feature explanation,
* database schema,
* setup instructions,
* demo flow.

Do not write long documentation unless requested.

Keep it concise and useful.

⸻

32. Demo Flow

The app should support a simple demo flow.

Recommended demo:

1. Open the app.
2. View auction list.
3. Search for an item by keyword.
4. Open item details.
5. Place a valid bid.
6. Try placing an invalid lower bid.
7. Simulate another user placing a higher bid.
8. Show the outbid notification.
9. Open “My Bids” and show the auction status.
10. Show that bidding is blocked after auction end.

Any code change should preserve this demo flow.

⸻

33. Data Seeds

For demo purposes, seed data may be useful.

Example auction items:

* Casque audio Bluetooth
* Montre connectée
* Sac à dos
* Clavier mécanique
* Jeu vidéo
* Appareil photo compact

Seed data should include:

* title,
* description,
* starting price,
* current price,
* image URL optional,
* end date in the future,
* active status.

Do not rely on real external APIs for demo data.

⸻

34. Image Handling

Images are optional unless required by the teacher.

Preferred simple approach:

* store image URLs as text,
* display them with React Native Image.

Do not implement image upload unless requested.

Do not add Supabase Storage unless specifically needed.

If images fail to load, the UI should still work.

⸻

35. Price Formatting

Prices should be displayed in euros.

Example:

25,00 €

Keep formatting simple.

A small utility function is acceptable:

formatPrice(25) // "25,00 €"

Do not introduce a currency library.

⸻

36. Date Formatting

Auction end dates should be understandable.

Examples:

Se termine le 28/05/2026 à 18:00

or:

Terminé

A simple utility function is acceptable.

Do not add a date library unless already installed.

⸻

37. Accessibility and Usability

Keep basic usability in mind:

* buttons should have clear text,
* inputs should have placeholders,
* errors should be readable,
* important actions should give feedback.

Do not hide important actions behind icons only.

⸻

38. Performance

This is a small school app.

Do not optimize prematurely.

Acceptable:

* simple filtering in memory for small lists,
* normal state updates,
* simple database queries.

Avoid:

* complex memoization everywhere,
* premature caching,
* virtualized optimization unless the list becomes large.

⸻

39. What Not To Do

Do not:

* build a full marketplace,
* add payment,
* add shipping,
* add chat,
* add ratings,
* add admin roles,
* create complex realtime systems,
* add unnecessary dependencies,
* refactor the whole project,
* rewrite working code without reason,
* invent database fields silently,
* ignore TypeScript errors,
* leave TODO comments instead of finishing small tasks,
* make the app impossible to explain during defense.

⸻

40. Expected Behavior From Codex

When asked to implement something, Codex should:

1. Inspect the existing project.
2. Explain assumptions.
3. Identify the minimal files to change.
4. Make surgical changes.
5. Verify the result.
6. Report exactly what changed.
7. Mention any limitations honestly.

Codex should not:

* silently change architecture,
* create unnecessary files,
* install packages without justification,
* invent requirements,
* produce huge diffs,
* hide uncertainty.

⸻

41. Current Priority Features

The current required features are:

1. Basic auction item browsing.
2. Auction detail view.
3. Bid placement.
4. Bid validation.
5. Keyword search.
6. Notifications when someone outbids the user.
7. Simple tracking of auctions where the user has placed bids.

These features matter more than visual polish.

⸻

42. Success Criteria

The project is successful if:

* the app runs on Expo,
* the main auction flow works,
* the user can search items,
* the user can place valid bids,
* invalid bids are rejected,
* ended auctions cannot receive bids,
* users can see auctions they participated in,
* a user receives an in-app notification when outbid,
* the code is simple enough to explain,
* the database choice is justified,
* the project does more than a basic CRUD app.

⸻

43. Final Rule

When in doubt, choose the simplest solution that satisfies the school requirement.

Do not impress with complexity.

Impress with clarity.

---

# 44. Exam Submission Requirements

These requirements are mandatory for the final React Native project submission.
The project must be prepared with the exam constraints in mind, not only with development convenience.

## Deadline

The final submission deadline is:

```txt
28 May 2026 at 23:59
```

Both required submission channels must be completed before the deadline.

Missing one required submission element results in a direct grade of 0.

⸻

45. Project Idea Validation

Before development, the project idea must be validated by the teacher.

For this project, the validated idea should be:

Bidly — a simple mobile auction application built with React Native.

If the idea changes significantly, the updated idea must be submitted again for approval before continuing development.

Do not change the core concept of the app without warning the user.

Changing Bidly into another type of app, or adding a completely different scope, risks invalidating the project.

The idea validation document must mention:

* the concept,
* the target users,
* the key MVP features.

Recommended validation summary:

Bidly is a simple mobile auction application. Users can browse auction items, search by keyword, view item details, place bids, track auctions they participate in, and receive an in-app notification when another user outbids them.

⸻

46. Required Final Deliverables

The final submission has two mandatory deliverables.

Both are required.

1. ZIP File

The full project must be compressed into one .zip file and uploaded to Moodle.

The ZIP must include:

* the full source code,
* the PDF report,
* the README if present,
* configuration documentation if needed.

The ZIP must not include:

* node_modules,
* unnecessary cache folders,
* build artifacts that make the archive too heavy.

Before creating the ZIP, remove or exclude:

node_modules/
.expo/
dist/
build/

Do not delete source files.

⸻

2. GitHub Repository Link

The GitHub repository link must be sent by email to the teacher.

The repository must be public.

A private repository that the teacher cannot access counts as missing.

The repository must contain a real commit history.

Do not create the repository at the last minute with a single final commit.

Use regular commits during development.

Recommended commit style:

feat: add auction list screen
feat: add bid validation
feat: add keyword search
feat: add notifications screen
fix: prevent bids after auction end
docs: add final PDF report

⸻

47. Email To Teacher

The GitHub link must be sent by email before the deadline.

The email subject must follow this format:

[React Native] Remise projet — <Nom Prénom>

Do not invent another subject format.

The email should include:

* a short message,
* the public GitHub repository link,
* a note that the ZIP was uploaded to Moodle.

Suggested email body:

Bonjour,
Voici le lien vers mon dépôt GitHub public pour le projet React Native :
<lien GitHub>
Le fichier ZIP du projet a également été déposé sur Moodle.
Bien à vous,
<Nom Prénom>

⸻

48. PDF Report Requirement

A PDF report is mandatory.

The PDF must be present in two places:

1. inside the ZIP uploaded to Moodle,
2. at the root of the public GitHub repository.

The PDF should be named clearly.

Recommended name:

dossier-remise-bidly.pdf

Do not hide the PDF inside a random subfolder.

Place it at the project root.

⸻

49. Required PDF Content

The PDF report must contain the following sections.

Do not skip any section.

1. Rappel du sujet

Briefly describe the application.

For Bidly:

Bidly est une application mobile d'enchères simples développée avec React Native. Elle permet à un utilisateur de consulter des objets mis aux enchères, de rechercher un objet par mot-clé, de consulter le détail d'une enchère, de placer une offre, de suivre les enchères auxquelles il participe et d'être notifié lorsqu'un autre utilisateur surenchérit.

⸻

2. Spécifications des choix

List all implemented features exhaustively.

Only list features that are actually implemented.

Do not claim unfinished or broken features.

Expected features may include:

* auction item list,
* item detail screen,
* bid placement,
* bid validation,
* keyword search,
* in-app outbid notifications,
* tracked auctions / my bids screen,
* auction end handling,
* simple user identification or authentication,
* loading states,
* error states.

If a feature is planned but not finished, clearly mark it as not implemented.

⸻

3. Justification technique

Explain the technical choices.

Mention and justify:

* React Native,
* Expo,
* TypeScript,
* local demo data or Supabase,
* navigation choice,
* state management choice,
* API/data access choice,
* styling choice,
* notification approach.

Example guidance:

Supabase was chosen because an auction system needs shared remote data between users. It allows the application to store auction items, bids and notifications in a central database. This is more realistic than SQLite for an auction app because multiple users can interact with the same auction.

If using Fetch instead of Axios:

Fetch was used because the project does not require advanced HTTP interceptors or a complex API layer. It keeps the code simple and avoids adding an unnecessary dependency.

If using Supabase client:

The Supabase client was used instead of manual HTTP requests because it provides direct access to the database and authentication features while keeping the code readable.

⸻

4. Architecture

Explain the project structure and data flow.

The PDF must describe:

* main folders,
* role of screens,
* role of components,
* role of services,
* role of types,
* how data moves through the app.

Example for Bidly:

The screens contain the main pages of the application, such as the auction list, auction detail, my bids and notifications. Components are reused UI blocks such as auction cards and bid forms. Services contain the database logic, for example loading auctions, placing bids and creating notifications. Types define the TypeScript structures used across the app.

Also explain at least one important data flow.

Recommended flow to explain:

When a user places a bid, the bid form validates the entered amount, then calls the bid service. The service checks the current auction state, rejects the bid if the auction has ended or if the amount is too low, inserts the bid, updates the auction current price and creates an outbid notification for the previous highest bidder if needed. The screen then refreshes the displayed auction data.

⸻

5. Auto-evaluation

The PDF must contain a table comparing announced features and implemented features.

Recommended format:

| Fonctionnalité annoncée | Réalisée ? | Commentaire |
|---|---|---|
| Liste des enchères | Oui | Les enchères sont affichées avec leur prix actuel. |
| Recherche par mot-clé | Oui | La liste est filtrée selon le texte saisi. |
| Détail d'une enchère | Oui | L'utilisateur peut consulter les informations complètes. |
| Placement d'une enchère | Oui | Le formulaire permet de proposer un montant. |
| Validation des enchères | Oui | Les montants trop bas ou les enchères terminées sont refusés. |
| Notifications de surenchère | Oui / Partiel | Notification in-app lorsqu'un autre utilisateur surenchérit. |
| Suivi des enchères | Oui / Partiel | L'utilisateur peut voir les enchères auxquelles il a participé. |

Be honest.

Do not mark a feature as complete if it is broken or only mocked.

⸻

50. README Requirement

If the app requires configuration, the README must explain it.

The README should include:

* project name,
* short description,
* installation steps,
* launch command,
* required environment variables,
* database setup if needed,
* demo account if authentication exists.

Minimum README structure:

# Bidly
Application mobile d'enchères simples réalisée avec React Native et Expo.
## Installation
npm install
## Lancement
npx expo start
## Configuration
Créer un fichier .env à la racine du projet avec :
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
## Fonctionnalités
- Liste des enchères
- Recherche par mot-clé
- Détail d'une enchère
- Placement d'une enchère
- Notifications de surenchère
- Suivi des enchères

If there are no environment variables, say so clearly.

⸻

51. Environment Configuration Documentation

Any required configuration must be documented.

This includes:

* .env variables,
* Supabase URL,
* Supabase anon key,
* database setup,
* required SQL scripts,
* demo accounts,
* Expo setup.

If the app cannot start because configuration is missing and this is not documented, the project can receive a direct 0.

Therefore:

* never add a required environment variable without documenting it,
* never rely on hidden local setup,
* never assume the teacher knows how to configure the app.

⸻

52. App Launch Requirement

The app must launch without crashing.

A startup crash is a direct 0.

Before final submission, verify:

npm install
npx expo start

or use the actual commands from package.json.

The app must not crash on the first screen.

If Supabase is unavailable or empty, the app should show a readable error or empty state, not crash.

Required startup checks:

* no missing imports,
* no broken navigation,
* no missing environment variables without explanation,
* no TypeScript errors that prevent the app from running,
* no screen crash caused by undefined data.

⸻

53. Oral Exam Constraints

The oral exam represents the majority of the grade.

The user must be able to explain the project without AI during the exam.

During the oral exam, AI tools are forbidden.

Therefore, code must remain understandable and defensible.

Do not generate code that is too advanced for the user to explain.

Avoid:

* complex abstractions,
* hidden magic,
* unreadable hooks,
* unnecessary custom frameworks,
* advanced TypeScript tricks,
* complicated database logic spread across many files.

Prefer clear code that can be explained line by line.

⸻

54. Oral Exam — Theory Question

The oral exam may include a theoretical question about React Native.

The project should not hide basic React Native concepts.

The user should be able to explain:

* what a component is,
* what props are,
* what state is,
* what useState does,
* what useEffect does,
* how navigation works,
* how a form input is handled,
* how data is loaded,
* how conditional rendering works.

When implementing features, keep these concepts visible and understandable.

⸻

55. Oral Exam — Application Flow Question

The teacher may ask how data moves from one part of the app to another.

Codex must keep important flows easy to explain.

Important flows to prepare:

Auction list flow

The screen loads auction items from the database, stores them in component state, applies the keyword search filter, then displays each item with an AuctionCard component.

Bid flow

The user enters an amount in the bid form. The screen validates the value and calls the bid service. The service checks the auction, inserts the bid if valid, updates the current price and creates a notification for the previous highest bidder if needed.

Notification flow

When a user is outbid, a notification row is created for that user. The notifications screen loads notifications linked to the current user and displays unread messages.

Search flow

The search text is stored in state. The auction list is filtered by comparing the search text with the item title and optionally the description.

Do not implement these flows in a way that is impossible to explain simply.

⸻

56. Oral Exam — Live Coding

The oral exam includes live coding.

The teacher may ask for a small modification such as:

* add a button,
* change a display condition,
* filter a list,
* change a label,
* add a simple validation,
* modify the way data is displayed.

The project must remain easy to modify live.

Therefore:

* keep screens readable,
* avoid huge files where everything is mixed,
* avoid logic hidden in too many abstractions,
* avoid components that are impossible to understand quickly,
* use clear names,
* keep filtering and validation logic simple.

A good live coding-ready project is better than an over-engineered project.

⸻

57. Clean Code Requirement

The code must respect naming conventions, clean code principles and the architecture seen in class.

This means:

* clear file names,
* clear function names,
* no unused imports,
* no unused variables,
* no dead code,
* no massive unreadable functions,
* no duplicated logic when a small helper would be clearer,
* no unclear abbreviations,
* no console logs left everywhere,
* no commented-out old code.

Before final submission, remove:

* debug logs,
* unused test code,
* unused screens,
* temporary comments,
* broken experiments.

Do not remove code that is necessary for the demo.

⸻

58. GitHub Repository Requirements

The GitHub repository must be public and complete.

It must contain:

* source code,
* package.json,
* README,
* PDF report at root,
* required configuration documentation,
* real commit history.

It must not contain:

* node_modules,
* private keys,
* service role keys,
* personal secrets,
* useless large files.

Before final submission, verify the repository from a browser in private navigation if possible.

If the repository cannot be opened publicly, it does not count.

⸻

59. Final ZIP Checklist

Before creating the ZIP:

* app launches correctly,
* PDF report is present,
* README is present if needed,
* .env requirements are documented,
* node_modules is excluded,
* GitHub repository is updated,
* latest code is committed,
* no secrets are included,
* no useless large folders are included.

The ZIP must contain the actual project, not only selected files.

Recommended ZIP name:

bidly-react-native-nom-prenom.zip

⸻

60. Final Submission Checklist

Before the deadline, verify all of this:

[ ] Project idea validated by teacher
[ ] App launches without crash
[ ] ZIP created without node_modules
[ ] ZIP uploaded to Moodle
[ ] GitHub repository is public
[ ] GitHub repository contains full commit history
[ ] GitHub repository contains PDF at root
[ ] PDF is also inside the ZIP
[ ] README explains how to install and launch the app
[ ] Required environment variables are documented
[ ] Email sent to teacher with the GitHub link
[ ] Email subject follows required format

If any required item is missing, the project is at risk of direct 0 or invalidation.

⸻

61. Final Development Priority

From now until submission, priority order is:

1. App launches without crash.
2. Core auction flow works.
3. Keyword search works.
4. Outbid notification works at least as an in-app notification.
5. PDF report is complete and honest.
6. README explains setup clearly.
7. GitHub is public and up to date.
8. ZIP is clean and submitted on Moodle.
9. UI polish only after the above is safe.

Do not prioritize visual polish over launch stability or required deliverables.

⸻

62. Absolute Final Rule For This Exam

A simple app that launches, is documented, and can be explained is better than an ambitious app that crashes or cannot be defended.

Do not sacrifice clarity for impressiveness.

For every coding decision, ask:

Can the user explain this during the oral exam without AI?

If not, simplify.
