# Front-end architecture

This application uses the Next.js App Router. Keep `src/app` focused on route composition and framework boundaries; put business behavior in `src/features`, reusable UI in `src/components`, and shared infrastructure in the core folders under `src`.

```text
src/
  app/             Next.js routes, layouts, loading/error boundaries, route handlers
  features/        Business domains; each owns its components, hooks, services, state,
                   schemas, types, utilities, and a public index.ts
  components/      Shared UI, layout, forms, feedback, and common components
  lib/             Shared API client, auth integration, utilities, validators
  hooks/           Cross-feature hooks
  services/        Cross-feature external service integrations
  store/           Global application state
  providers/       App-wide context providers
  config/          Environment and application configuration
  constants/       Shared constants
  types/           Shared TypeScript contracts
  styles/          Shared styles
  i18n/            Internationalisation resources
  assets/          Source assets imported by code
public/             Static files served directly by Next.js
```

## Conventions

- Route files in `src/app` stay thin and import feature entry points. Route groups such as `(auth)` or `(dashboard)` organize URLs without appearing in the URL.
- Keep code used by one business domain inside its `src/features/<domain>` folder. Expose supported imports through that feature's `index.ts`.
- Put components in `src/components` only when they are shared across features; use `src/components/ui`, `layout`, `forms`, `feedback`, and `common` by role.
- Put cross-domain infrastructure in the core folders. Avoid creating abstractions until there is code that needs them.
- Keep static public files in `public`; keep source assets in `src/assets`.
- Put automated tests in `tests`, architecture notes in `docs`, and maintenance scripts in `scripts`.

The home route lives at `src/app/page.tsx`; its UI is implemented in `src/features/home`. Add new routes as their product requirements are defined, then connect them to the appropriate feature.

## Run locally

```bash
npm install
npm run dev
```

## Hostinger deployment

This frontend runs as a Next.js Node.js application and does not connect to MySQL directly. In Hostinger, create a **Node.js Web App** from this GitHub repository, select Node.js 24, and use the existing commands:

- Build: `npm run build`
- Start: `npm run start`

Hostinger's GitHub deployment builds and starts the app. No FTP workflow or frontend database is required. The app uses the full Next.js Node runtime; do not enable static export.

The `.github/workflows/production.yml` workflow runs on changes to `main`, pull requests targeting `main`, or a manual run. It installs dependencies and verifies that the production build succeeds; it does not upload or deploy files. Hostinger remains responsible for deployment. If the production API is ready, set the GitHub Actions repository variable `PRODUCTION_API_BASE_URL` so pull request and production builds use the correct API URL.

The frontend can be deployed before the API exists. The public pages continue to work, and sign-in or student-content features display a connection message until the API URL is configured. When the API subdomain is ready, set both `NEXT_PUBLIC_API_BASE_URL` and `AUTH_API_BASE_URL` to its base URL in the Hostinger app settings. `NEXT_PUBLIC_API_BASE_URL` is embedded during the build, so rebuild/redeploy after setting or changing it. Keep database credentials on the backend only.
## Motion components

Shared animation primitives live in `src/components/motion` and are exported from `@/components/motion`:

- `MotionProvider` applies Motion's `reducedMotion="user"` policy globally.
- `Reveal` provides a configurable, once-by-default viewport entrance.
- `Stagger` and `StaggerItem` animate groups with consistent sequencing.

Use these for meaningful content transitions. Prefer CSS transitions for simple hover/focus color changes, and keep essential content readable without relying on animation.
- `src/components/ui` contains the shared Button, Input, and composable Card primitives. The Button has typed variants/sizes, disabled/loading states, ref forwarding, and hover/press feedback; Input connects labels, help text, and errors to the field; Card exports semantic sections.
### Top navigation

The reusable `TopNavigation` component lives in `src/components/layout/top-navigation`. Pass the route links as typed `items` so it never points at pages that have not been built. It includes current-page indication, a responsive mobile disclosure menu, Escape-to-close behavior, an optional action slot, and a skip link targeting `#main-content`.

Example:

```tsx
<TopNavigation
  items={[
    { label: "Home", href: "/" },
    { label: "Subjects", href: "/subjects" },
  ]}
/>
```

Add it to a shared route-group layout when those navigation destinations are ready. Pages using the skip link should give their main content `id="main-content"`.
