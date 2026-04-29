# Can I Use This Yet

A small web app for deciding when modern Web Platform features are mature enough to adopt in a product baseline.

The app uses the public `web-features` dataset and focuses on the four core browsers: Chrome, Edge, Firefox, and Safari. Instead of showing raw compatibility data, it turns each feature's Baseline Low date into an adoption date by adding a configurable safety window. The default window is 30 months, but users can adjust it in the UI.

## Product Scope

The main screen answers two practical planning questions:

- Which web features became eligible for adoption in the last six months?
- Which features are expected to become eligible in the next six months?

Features are grouped by eligibility month and shown with their name, description, specification links, Baseline Low date, calculated availability date, and browser support versions. A global search mode lets users find features across the full dataset when it is available.

This is intentionally not a full `Can I Use` replacement. It is a narrower planning tool for teams that want a conservative, time-based view of when features can enter their supported baseline.

## How It Works

The eligibility calculation is shared between the client and server:

1. Load feature records from the `web-features` dataset.
2. Keep feature entries with a usable `status.baseline_low_date`.
3. Add the configured eligibility lag, in months, to produce an adoption date.
4. Place each feature into the recent or upcoming six-month window.
5. Group and sort the resulting records by month.

The selected eligibility lag is stored in a cookie, so the same policy survives page reloads.

## Technical Overview

The project is a Nuxt 4 application using Vue 3, Nuxt UI, Tailwind CSS, and Nitro. The UI is a single-page experience composed from Nuxt components and composables, while the shared feature-window logic lives under `shared/` so it can be reused by both the app and server routes.

The server exposes `/api/web-features`, backed by a Nitro storage layer. In production the app targets Cloudflare and uses Cloudflare KV for the cached dataset. A scheduled Nitro task refreshes the cached `web-features` data daily, with remote fetch fallback behavior handled in the server utility layer.

At startup, the page requests a server-filtered recent window for fast initial rendering. The full dataset is then loaded client-side to enable search, the upcoming tab, and live recalculation when the eligibility window changes.

## License

See `LICENSE` for the repository license.
