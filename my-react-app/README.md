# Northstar Inventory Desk

A React + Vite interview project that demonstrates:

- Redux Toolkit state management with async thunks
- Protected authentication flow using DummyJSON
- JWT persistence in `localStorage`
- Product table data fetched through Redux
- CRUD operations with optimistic UI updates against DummyJSON's simulated product endpoints
- Material UI based interface with responsive layouts

## Tech Stack

- React 19
- Vite 8
- Redux Toolkit
- React Redux
- React Router DOM
- Material UI

## Getting Started

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
```

## Demo Credentials

Use DummyJSON's sample account:

- Username: `emilys`
- Password: `emilyspass`

## Project Structure

```text
src/
  api/          API helpers for DummyJSON
  app/          Redux store and shared hooks
  components/   Reusable UI building blocks
  features/     Auth and products Redux slices
  pages/        Route-level screens
  utils/        Browser storage helpers
```

## Key Implementation Choices

- `createAsyncThunk` is used for all API requests so async behavior stays in Redux rather than inside page components.
- Authentication is restored on refresh via a bootstrap thunk that reads the stored token and rehydrates the current user.
- Products are requested from Redux on both the list page and the CRUD page, keeping the UI aligned with the task requirement to source data from the store.
- Registration uses DummyJSON's simulated user creation endpoint. Because DummyJSON does not persist newly created accounts for authentication, the UI clearly communicates that limitation.
- Product create, update, and delete endpoints are also simulated by DummyJSON. The Redux slice updates local state immediately so the interface behaves like a real admin panel.

## Notes for Interview Discussion

- The assignment mentions a "todo application", but the API steps center on authentication and products. This implementation follows the detailed functional steps and delivers a product-management dashboard.
- The CRUD studio intentionally highlights total records and quick metrics so the dedicated records page is more informative than a simple table.
- Vite build chunking is configured to split larger dependency groups for a cleaner production output.
