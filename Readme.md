<p align="center">
  <img src="docs/screenshots/lucid-logo-full.png" alt="Lucid Math logo" width="220" />
</p>

# Lucid Math

Lucid Math is an adaptive mathematics learning platform for Ghanaian students and the teachers guiding their progress. It combines a React frontend, an ASP.NET Core backend, PostgreSQL persistence, Identity/JWT authentication, learner profiles, assessments, admin analytics, and a Gemini-backed AI Tutor integration.

## Current Status

### Student Workspace

- Public landing page, registration, and sign-in.
- Protected student dashboard with progress metrics, recommendations, topic performance, assessment trend, recent activity, and quick actions.
- Topics and assessment flows backed by the ASP.NET Core API.
- Learner Profile and Learning History pages backed by real API data.
- AI Tutor workspace with learner-profile context, Gemini backend endpoint, local fallback responses, quick prompts, and session reset.
- Settings page with real profile update support and local preference controls where backend settings APIs do not exist yet.

### Teacher/Admin Workspace

- Protected teacher shell that displays the human-friendly role `Teacher` while preserving backend authorization role `Admin`.
- Teacher dashboard using `GET /api/dashboard/admin`.
- Students page with search/filter table and learner-profile detail modal.
- Assessments page using admin assessment summaries.
- Questions page with real question-bank create/edit/delete support.
- Analytics page using Chart.js and admin dashboard/topic performance data.
- Settings page with account display, local teaching preferences, notification controls, appearance controls, and sign out.

### Backend

- Layered ASP.NET Core API:
  - `MathTutor.Domain`
  - `MathTutor.Application`
  - `MathTutor.Infrastructure`
  - `MathTutor.API`
- PostgreSQL with Entity Framework Core migrations.
- ASP.NET Core Identity, role seeding, JWT authentication, and authorization.
- Student, topic, question, assessment, learner profile, learning history, dashboard, admin assessment, and AI Tutor endpoints.
- Development Data Protection keys are stored locally in `MathTutor.API/DataProtectionKeys/`, which is ignored by git.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Chart.js / react-chartjs-2
- Lucide React icons

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Core Identity
- JWT Bearer authentication
- PostgreSQL
- Gemini API for AI Tutor responses

## Running Locally

### 1. Start PostgreSQL

PostgreSQL must be running on port `5432`.

```powershell
Start-Service postgresql-x64-18
```

The local backend currently expects:

```text
Host=localhost;Port=5432;Database=LucidMathDB;Username=postgres;Password=12345
```

Update `backend/MathTutor.API/appsettings.json` if your local PostgreSQL credentials differ.

### 2. Configure Gemini For AI Tutor

The Gemini API key must stay server-side. For local development, store it with .NET user secrets from the `backend` folder:

```powershell
dotnet user-secrets set "LUCID_API" "your-gemini-api-key" --project MathTutor.API
```

The backend defaults to:

```text
gemini-3.6-flash
```

You can override the model if needed:

```powershell
dotnet user-secrets set "LUCID_AI_MODEL" "gemini-3.6-flash" --project MathTutor.API
```

### 3. Run Backend

From `backend`:

```powershell
dotnet tool restore
dotnet restore
dotnet ef database update --project MathTutor.Infrastructure --startup-project MathTutor.API --context ApplicationDbContext
dotnet run --project MathTutor.API
```

Backend URL:

```text
http://localhost:5152
```

Health check:

```text
http://localhost:5152/health
```

### 4. Run Frontend

From `frontend`:

```powershell
npm install
npm.cmd run dev
```

Frontend URL:

```text
http://localhost:5173
```

The frontend expects `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5152/api
```

## Demo Accounts

Startup seeding creates:

- Admin/Teacher: `admin@lucidmath.local` / `Admin12345`
- Roles: `Student`, `Teacher`, `Admin`
- Demo topics and multiple-choice questions

Students can also register through the frontend.

## Key API Endpoints

### Auth

- `POST /api/Auth/register`
- `POST /api/Auth/login`

### Student

- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/dashboard/student`
- `GET /api/learner-profile/me`
- `GET /api/learning-history/me`
- `POST /api/ai-tutor/message`

### Topics And Questions

- `GET /api/topics`
- `POST /api/topics` Admin
- `PUT /api/topics/{id}` Admin
- `DELETE /api/topics/{id}` Admin
- `GET /api/questions`
- `POST /api/questions` Admin
- `PUT /api/questions/{id}` Admin
- `DELETE /api/questions/{id}` Admin

### Assessments

- `GET /api/assessments/availability`
- `POST /api/assessments/start` Student
- `POST /api/assessments/{assessmentId}/submit` Student
- `GET /api/assessments/{assessmentId}`
- `GET /api/assessments/my-history`
- `GET /api/admin/assessments` Admin

### Teacher/Admin

- `GET /api/dashboard/admin`
- `GET /api/Student`
- `GET /api/Student/{id}`
- `GET /api/learner-profile/student/{studentId}`

## Verification Commands

Backend:

```powershell
dotnet build
```

Frontend:

```powershell
npm.cmd run build
npm.cmd run lint
```

Current verification status:

- Backend build: passing
- Frontend build/type-check: passing
- Frontend lint: passing
- Teacher routes verified: dashboard, students, assessments, questions, analytics, settings
- Student routes implemented: dashboard, topics, assessments, learner profile, learning history, AI Tutor, settings

## Deployment Status

Azure deployment was attempted earlier, but no successful Azure deployment was completed because the Microsoft account did not have access to the required subscription/resource group.

The project has been returned to local-development mode:

- Generated publish output was removed.
- Backend ZIP deployment artifact was removed.
- Azure CLI remains installed on the machine.
- No Azure resources are created by the local workflow.

Generated build/deployment artifacts are ignored:

- `bin/`
- `obj/`
- `backend/publish/`
- `backend/*.zip`

## Known Missing Backend Work

- Teacher-managed assessment creation/edit/publish/unpublish/delete.
- Student creation flow that also provisions an Identity login account.
- Teacher preference persistence.
- Notification delivery/settings persistence.
- Password-change endpoint.
- Account deletion endpoint.
- Dedicated teaching-style distribution aggregate.
- Persistent AI Tutor session history.

## Notes

- The frontend displays Admin users as `Teacher` for the user interface.
- Backend authorization still uses the role value `Admin`.
- API keys must never be placed in frontend `.env` files or committed source code.
