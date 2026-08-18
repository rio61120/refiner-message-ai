# warriorAI

NestJS backend for authenticated warriorAI APIs backed by PostgreSQL, Redis, BullMQ, and a reusable AI layer.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:migrate
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
DATABASE_URL=postgresql://warriorai:warriorai@localhost:5432/warriorai?schema=public
JWT_SECRET=replace-with-a-long-random-secret
ACCESS_TOKEN_TTL_SECONDS=604800
REDIS_HOST=localhost
REDIS_PORT=6379
```

`CORS_ORIGIN` accepts comma-separated origins or full URLs. Full URLs are normalized to their origin, so `https://mail.google.com/mail/u/0/#chat/...` becomes `https://mail.google.com`.

Supported providers:

- `openai`: official OpenAI API
- `openai-compatible`: any gateway with OpenAI-compatible chat completions

## API

Auth endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

`/auth/register` and `/auth/login` return an access token:

```json
{
  "accessToken": "jwt_token",
  "expiresAt": "2026-08-25T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "user_name": "user_name",
    "name": "User"
  }
}
```

All non-public endpoints require:

```http
Authorization: Bearer jwt_token
```

`POST /ai/chat`

Generic AI chat endpoint. Returns `text/event-stream`.

```json
{
  "prompt": "Write a short launch announcement for warriorAI.",
  "systemPrompt": "You are a concise product copywriter."
}
```

`POST /refine`

Message refinement endpoint built on top of the shared AI layer. Returns `text/event-stream`.

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

## Structure

- `src/ai`: reusable AI API, LLM provider integration, and prompt templates
- `src/refine`: refine-specific API and request orchestration
- `src/auth`: authentication, sessions, and global API guard
