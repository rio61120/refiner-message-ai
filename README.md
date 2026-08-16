# Refiner Message Backend

NestJS backend for streaming message refinement results to the Chrome extension.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

## Docker

```bash
docker compose up --build
```

The compose service reads runtime config from `.env`, publishes the API on `127.0.0.1:3001`, and sets `HOST=0.0.0.0` inside the container so the mapped port is reachable from the host machine.

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
