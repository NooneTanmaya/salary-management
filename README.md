# Salary Management Frontend

Frontend application for the Salary Management System built with React and Vite.

## Overview

This app connects to the backend server at `http://localhost:5000` to manage employee records and display salary statistics.

## Features

- View employee list
- Add a new employee
- Delete employees
- Display summary cards for:
  - total employees
  - total salary
  - average salary

## Requirements

- Node.js 18+ or compatible
- npm
- Backend running at `http://localhost:5000`

## Install

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

Open the application at the URL shown in the terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the production bundle
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint on the project

## Notes

- Ensure the backend is running before using the app to avoid network errors.
- The frontend uses Axios to call the backend APIs.
- Employee data is loaded from the backend.
