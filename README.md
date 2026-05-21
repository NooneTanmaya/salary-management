# Salary Management — Frontend

A React + Vite frontend for the Salary Management application. This app displays the employee list, allows adding and deleting employees, and shows summary metrics (total employees, total salary, average salary).

## Quick start

Prerequisites:
- Node.js 18+ (or compatible) and `npm`
- The backend API (see `../backend`) running locally or reachable from this machine

Install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Open the URL displayed by Vite (typically `http://localhost:5173`).

## Environment configuration

The frontend reads the backend base URL from the `VITE_API_URL` environment variable. By default the app expects the backend on port `5000`:

```text
http://localhost:5000
```

To override, create a `.env` file in the `frontend` folder:

```text
VITE_API_URL=http://localhost:5000
```

After changing `.env`, restart the dev server to pick up new variables.

## Scripts

- `npm run dev` — start dev server with hot reload
- `npm run build` — produce a production build in `dist`
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint (if configured)

## API endpoints used by the frontend

The frontend expects the backend to provide these endpoints:

- `GET /employees` — return an array of employee objects
- `GET /summary` — return `{ totalEmployees, totalSalary, averageSalary }`
- `POST /employees` — add a new employee (JSON body)
- `DELETE /employees/:id` — delete an employee by id

Example of the summary response:

```json
{
  "totalEmployees": 123,
  "totalSalary": 9876543,
  "averageSalary": 80324.22
}
```

## Development notes

- Main source: `frontend/src/App.jsx`.
- The UI uses Axios to call the backend and automatically refreshes the summary after add/delete operations.
- If the summary cards do not update after a change, confirm the backend is running and that `VITE_API_URL` points at the correct server.

## Troubleshooting

- Backend unreachable: verify the backend server is running (`backend/server.js`) and CORS is enabled. Default backend port: `5000`.
- Port conflicts: change Vite port by setting `PORT` when starting Vite or configure Vite settings in `vite.config.js`.
- Environment variables not picked up: stop and restart the dev server after editing `.env`.

## Build & Deploy

When building for production, run:

```bash
npm run build
```

Serve the `dist` folder with a static server or integrate into your preferred hosting pipeline. Make sure the deployed frontend is configured to call the correct backend URL.

## Contributing

Report issues or open a PR with improvements. For local development, run the backend and frontend concurrently in separate terminals.

## Where to look next

- Frontend app: `frontend/src`
- Backend app: `backend` (API, data, and seed scripts)

---
If you'd like, I can also commit this README update and push it to the repository; tell me when to proceed.
