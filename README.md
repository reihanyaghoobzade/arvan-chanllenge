# Arvan Challenge — RealWorld-style Blog App

My take-home challenge for **Arvan Cloud** (implemented during the hiring process in 2023): a RealWorld-style blog application built with **Vue 3, Vite, Pinia, and TanStack Vue Query**.

## Features

- **Authentication** — sign up / sign in via the RealWorld API, session persisted in cookies
- **Articles feed** — paginated list with global feed
- **Article detail** — full article view with author info
- **Create / edit articles** — form with validation
- **Toast notifications** and loading states across all async actions

## Tech Stack

- **Vue 3** (Composition API)
- **Vite**
- **Pinia** — auth & toast state
- **TanStack Vue Query** — server state, caching, and request deduplication
- **Axios** — API layer against [RealWorld API](https://github.com/gothinkster/realworld)
- **Bootstrap 5**, ESLint + Prettier

## Project Structure

```
src/
├── components/     # Article cards, login form, pagination, toasts
├── composables/    # reusable logic
├── views/          # routes: feed, login, editor, 404
├── stores/         # Pinia stores (auth, toast)
└── router/
```

## Getting Started

```bash
npm install
npm run dev        # start dev server
npm run build      # production build
npm run lint       # eslint
```

> **Note:** the app talks to the public RealWorld API (`api.realworld.io`) — no backend setup needed.
