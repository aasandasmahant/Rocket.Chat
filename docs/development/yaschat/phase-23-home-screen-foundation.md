# YasChat Stage 23 — Responsive Home Screen Foundation

## Delivered

- Added `apps/meteor/client/views/home/YasChatHomePage.tsx`.
- Added a responsive YasChat landing page using Rocket.Chat's existing `Page`, `PageScrollableContent`, and Fuselage `Box` components.
- Added a branded hero, four feature areas (product discovery, reviews, communities, and referral rewards), and a community-feed placeholder.
- Updated `HomePage.tsx` so the YasChat home is selected only when the Rocket.Chat `Site_Name` setting is `YasChat` (case-insensitive).
- Preserved the existing `Layout_Custom_Body_Only` route precedence and the default Rocket.Chat home for all other site names.

## Data integrity

This stage intentionally shows no sample products, prices, star ratings, user counts, posts, earnings, or partner connection claims. Product discovery, reviews, feed content, translation, and referral tracking remain unconnected and are clearly described as future work.

## Safety / compatibility choices

- No authentication, room routing, sidebar, navigation, or message code was changed.
- Existing custom-home configuration remains higher priority.
- The default Rocket.Chat home remains unchanged unless the site name is explicitly YasChat.

## Verification

- Both changed source files were fetched back from the target branch after writing.
- Branch comparison against `develop`: 64 commits ahead, 0 behind at verification time.
- GitHub commit status endpoint returned no status checks; workflow-runs endpoint returned no associated PR workflow runs.
- Build, typecheck, unit tests, and browser/mobile visual checks have **not** been run in this environment. Do not interpret an empty CI result as a passing test.

## Manual acceptance checklist

1. Set the Rocket.Chat `Site_Name` setting to `YasChat`; visit `/home` while signed in.
2. Confirm the YasChat hero and four feature cards render.
3. Check layout at narrow mobile width (360–390 px), tablet width, and desktop width.
4. Change `Site_Name` to a different value; confirm the original Rocket.Chat home renders.
5. Enable `Layout_Custom_Body_Only`; confirm the existing custom home still takes precedence.
6. Verify login, logout, room navigation, sidebar, and message sending remain unchanged.

## Next stage

Connect real product discovery only after the product provider and persistence layers are ready. Keep credentials empty until the owner supplies them; do not use fabricated catalogue records.
