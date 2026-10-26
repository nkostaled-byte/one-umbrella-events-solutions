# One Umbrella Events Solutions

Professional event setups, décor, furniture, equipment and infrastructure for weddings, corporate events, and special occasions.

## Features

- Modern, responsive event services website
- Quote/Enquiry form with multi-service selection
- Dark/light theme with liquid glass UI components
- Event gallery with lightbox
- Services showcase with pre-filled enquiry integration
- Direct contact via phone, WhatsApp, and Facebook

## Tech Stack

- **React 19** + TypeScript
- **Vite** for development and building
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Motion** for animations

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure:
   ```env
   VITE_FORMS_API_URL="https://your-worker.workers.dev/"
   VITE_FORMS_CLIENT_ID="your-client-id"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FORMS_API_URL` | The deployed Cloudflare Worker URL that handles form submissions |
| `VITE_FORMS_CLIENT_ID` | Your registered client ID in the My Grafix Forms system |

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Entry point
├── index.css            # Global styles & Tailwind imports
├── quoteSubmission.ts   # Form submission logic
├── quoteSubmission.test.mjs
tests/
public/
├── assets/              # Images and static assets
```

## Deployment

The `dist/` folder contains the production build. Deploy to any static hosting (Netlify, Vercel, Cloudflare Pages, etc.) or serve from your own infrastructure.

The form submissions are handled by a separate Cloudflare Worker (My Grafix Dashboard Worker) — configure `VITE_FORMS_API_URL` to point to that worker's endpoint.

## License

Private project – all rights reserved.