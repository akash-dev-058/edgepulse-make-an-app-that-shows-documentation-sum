# ReactDocsPulse

A high‑performance documentation aggregator for the **facebook/react** repository. It fetches raw markdown from the repo, generates AI‑powered summaries, and presents them in a searchable, accessible UI built with Next.js, TypeScript, Tailwind CSS, and React Query.

## Features

- Static generation with ISR for fast SEO‑friendly pages
- AI‑generated "Key Takeaways" summary cards
- Full‑text search powered by the backend API
- Responsive, accessible design following WCAG AA
- Dark‑mode ready (uses Tailwind's `media` strategy)
- Toast notifications for actions and errors
- Admin sync endpoint to trigger fresh data ingestion

## Getting Started

bash
# Clone the repo
git clone https://github.com/your-org/reactdocspulse.git
cd reactdocspulse

# Install dependencies
npm ci

# Copy env file and set variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Run the development server
npm run dev


The app will be available at `http://localhost:3000`.

## Building for Production

bash
npm run build
npm start


## Docker

bash
docker compose up --build


The container exposes port **3000**.

## Testing

bash
npm run lint
npm run test


## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, type‑checking, and tests on every push.

## License

MIT © ReactDocsPulse contributors
