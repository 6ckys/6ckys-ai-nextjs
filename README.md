# 6ckys AI Chat (Next.js)

A modern, extensible AI chat application built with [Next.js](https://nextjs.org/), React, and Tailwind CSS. It supports multiple AI models (Anthropic Claude, OpenAI GPT, Gemini, Grok, Llama, Deepseek, Perplexity, and more) and provides a sleek, responsive interface for managing conversations.

## Features

- **Multi-model support:** Easily switch between Anthropic, OpenAI, Google Gemini, Grok, Llama, Deepseek, Perplexity, and more.
- **Persistent chat history:** Conversations are stored locally for seamless continuity.
- **Sidebar navigation:** Quickly create, select, or delete chats; view usage statistics.
- **Export chats:** Download conversations as Markdown.
- **Responsive UI:** Works great on desktop and mobile.
- **Full-screen mode:** Focus on your conversation.
- **Modern stack:** Next.js App Router, React 19, Tailwind CSS 4, TypeScript.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build and start the app:
```bash
npm run build
npm start
```

### Docker

You can use Docker for local development or production:

- **Development:**
  ```bash
  docker-compose up nextjs-dev
  ```
- **Production:**
  ```bash
  docker-compose up nextjs-prod
  ```

## Project Structure

- `src/app/components/` – UI components (sidebar, chat, input, etc.)
- `src/app/contexts/` – React context for chat state management
- `src/app/utils/` – Utility functions (e.g., export to Markdown)
- `src/app/types/` – TypeScript types
- `public/` – Static assets (logo, favicon, etc.)

## Customization

- **Model list:** Edit `src/app/components/sidebar/ModelSelector.tsx` to add/remove models.
- **Branding:** Replace the logo in `public/logo/Logo-AG.png`.

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
