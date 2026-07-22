## Stack

- React 19 (hooks: `useState`, `useEffect`, `useMemo`)
- React Router 7 (client-side routing)
- Bootstrap 5 (mobile-first layout/utilities)
- Vite (dev server + build)
- ESLint (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

## Structure

```
src/
  App.jsx                  -> header, nav, theme toggle, mounts routes
  routes/AppRoutes.jsx     -> path -> page mapping
  pages/
    ConverterPage.jsx      -> conversion form + result
    HistoryPage.jsx        -> saved conversion list
  hooks/
    useCurrencies.js       -> fetches + session-caches supported currency list
    useConversionHistory.js -> localStorage-backed history (persists across reloads)
    useTheme.js            -> light/dark theme, persisted
  services/
    currencyApi.js         -> fetch wrappers calling the NestJS backend only
```

## Key behaviors

- **Dynamic currencies:** dropdowns are built from whatever `/currencies` returns — nothing hardcoded, so any currency the backend/provider supports shows up automatically.
- **Loaders:** `isLoading` (currency list) and `isConverting` (submit) both drive visible loading states.
- **Persistent history:** every completed conversion is pushed to `localStorage` via `conversionHistoryService`, so the History page survives a full page reload.
- **Historical rates:** an optional date field, when filled, is passed straight through to the backend, which switches to the historical-rate lookup instead of latest.
- **No API key on the client:** the frontend only ever talks to the local/deployed NestJS backend; the currency-provider key (if any) lives server-side only.
- **Mobile-first:** layout and form controls are built and tested primarily at mobile widths first, then scaled up.

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

Expects the backend at `VITE_BASE_URL` (defaults to `http://localhost:3000/api`).

## Deployment

- **GitHub:** 
- **Live demo:** 
