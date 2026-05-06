# Notification Logging Middleware

A minimal Node.js + Express sample implementing request logging middleware for a notification platform.

## Features
 Logs request method, URL, status code, duration, remote IP, and user agent.
 Includes request query and JSON body payloads when present.
 Provides sample endpoints for health check and notification creation.

## Run

1. install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Test endpoints:

```bash
curl http://localhost:3000/
```
4. Fetch the external notification feed and return a priority inbox sorted by placement > result > event and recency:

```bash
curl http://localhost:3000/notifications/fetch
```
5. Use the supported query parameters `limit`, `page`, and `notification_type` to control the fetched notifications. `top` is still accepted as an alias for `limit`.

```bash
curl http://localhost:3000/notifications/fetch?limit=15&page=1
curl http://localhost:3000/notifications/fetch?notification_type=result
curl http://localhost:3000/notifications/fetch?limit=10&notification_type=placement
```

Supported notification types:
- `event`
- `result`
- `placement`

If the external API requires authorization, set `NOTIFICATION_API_AUTH` in the environment before running the app.
