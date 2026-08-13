# Lucid Math Frontend

React + TypeScript + Vite frontend for Lucid Math.

## Features

- Public landing page.
- Student authentication screens.
- Student workspace:
  - Dashboard
  - Topics
  - Assessments
  - Learner Profile
  - Learning History
  - AI Tutor
  - Settings
- Teacher/Admin workspace:
  - Dashboard
  - Students
  - Assessments
  - Questions
  - Analytics
  - Settings
- Shared dashboard shell with rounded sidebar, glass main panel, reusable cards, and responsive layout.

## Configuration

Create or update `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5152/api
```

Do not put backend secrets or AI API keys in frontend `.env` files.

## Commands

```powershell
npm install
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

Frontend dev URL:

```text
http://localhost:5173
```

## Backend Dependency

The frontend expects the ASP.NET Core API to be running at:

```text
http://localhost:5152
```

AI Tutor requests go through the backend endpoint:

```text
POST /api/ai-tutor/message
```

The Gemini API key is configured on the backend with .NET user secrets, not in the frontend.
