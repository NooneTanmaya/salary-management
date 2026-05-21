# Salary Management Frontend

A React + Vite frontend for the Salary Management application.

## Overview

This frontend app displays employee payroll data and salary metrics, and allows users to add or delete employees. It communicates with the backend API to load employee data and perform updates.

## Features

- Display employee list
- Add a new employee
- Delete existing employees
- Show salary summary cards for:
  - total employees
  - total salary
  - average salary
- Search employees by name, country, or job title

## Requirements

- Node.js 18+ or compatible
- npm
- Backend API running locally

## Install

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

Open the application in your browser at the URL shown in the terminal (usually `http://localhost:5173`).

## Environment

The frontend uses the backend API base URL from the environment variable `VITE_API_URL`.

By default, it connects to:

```text
http://localhost:5000
```

To override the backend URL, create a `.env` file in `frontend` with:

```text
VITE_API_URL=http://localhost:5000
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the production bundle
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint across the project

## API Requirements

The frontend expects the backend to expose these endpoints:

- `GET /employees` — returns an array of employees
- `GET /summary` — returns summary statistics
- `POST /employees` — add a new employee
- `DELETE /employees/:id` — delete an employee by ID

## Notes

- Make sure the backend server is running before opening the frontend.
- The app uses Axios for HTTP requests.
- The frontend source is under `frontend/src`, with the main app in `frontend/src/App.jsx`.
