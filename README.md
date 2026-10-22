# News Finder

A React app to browse the latest headlines by category, powered by [NewsAPI](https://newsapi.org).

**Live demo:** https://noticias-api-woad.vercel.app

## Features

- Browse top headlines by category: general, business, entertainment, health, science, sports and technology
- Pagination (up to 100 results per category, the NewsAPI free plan limit)
- Responsive layout built with Material UI
- The NewsAPI key stays on the server: the browser only talks to `/api/news`
- Can be embedded in an `<iframe>`

## Tech stack

- [React 18](https://react.dev) + [Vite 8](https://vite.dev)
- [Material UI 5](https://mui.com)
- [Axios](https://axios-http.com)
- [Vercel Functions](https://vercel.com/docs/functions) for the API proxy

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- A free NewsAPI key from https://newsapi.org/register

### Setup

```bash
npm install
cp .env.example .env
```

Add your key to `.env`:

```bash
NEWS_API_KEY=your_newsapi_key
```

`.env` is ignored by git and must never be committed.

### Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server (includes `/api/news`) |
| `npm run build`   | Build for production into `dist/`        |
| `npm run preview` | Preview the production build             |

## Project structure

```
api/news.js            Serverless proxy to NewsAPI (validates category and page)
src/context/           Global state and data fetching
src/components/        Form, news list and news card
src/hooks/             useNoticias hook
vercel.json            Response headers (iframe embedding, security headers)
```

## API

`GET /api/news?category=<category>&page=<1-5>`

Returns `{ totalResults, articles }` from NewsAPI top headlines. Invalid categories or pages return `400`.

## Deploying to Vercel

1. Import the project in Vercel (framework preset: Vite).
2. Add the `NEWS_API_KEY` environment variable in **Settings → Environment Variables**.
3. Deploy.

## Embedding

```html
<iframe
  src="https://noticias-api-woad.vercel.app"
  width="100%"
  height="800"
  style="border: 0"
  title="News Finder"
></iframe>
```

## Notes

- NewsAPI no longer returns top headlines for Mexico (`country=mx`), so the app shows US headlines.
- The NewsAPI Developer plan is intended for development. Check the [NewsAPI pricing](https://newsapi.org/pricing) before using it in production.
