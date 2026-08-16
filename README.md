# Refiner Message Backend

NestJS backend for streaming message refinement results to the Chrome extension.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Required env:

```bash
AI_PROVIDER=openai-compatible
AI_API_KEY=your_key
AI_BASE_URL=https://your-openai-compatible-gateway/v1
AI_MODEL=gpt-4o-mini
```

`CORS_ORIGIN` accepts comma-separated origins or full URLs. Full URLs are normalized to their origin, so `https://mail.google.com/mail/u/0/#chat/...` becomes `https://mail.google.com`.

Supported providers:

- `openai`: official OpenAI API
- `openai-compatible`: any gateway with OpenAI-compatible chat completions

## API

`POST /refine`

Returns `text/event-stream`.

```json
{
  "action": "grammar",
  "message": "I has a question",
  "targetLanguage": "Vietnamese"
}
```

Events:

- `delta`: streamed text chunk
- `done`: final signal
- `error`: failure message
