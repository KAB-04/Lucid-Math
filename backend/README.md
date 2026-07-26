# Lucid Math Backend

ASP.NET Core Web API backend for Lucid Math, an adaptive mathematics learning app for Ghanaian JHS, SHS and pre-university students.

## Architecture

- `MathTutor.Domain`: entities and Identity user model.
- `MathTutor.Application`: DTOs, repository/service interfaces, and application services.
- `MathTutor.Infrastructure`: EF Core `ApplicationDbContext`, migrations, repositories, and seed data.
- `MathTutor.API`: controllers, authentication, authorization, dependency injection, and API startup.

## Requirements

- .NET 10 SDK
- PostgreSQL
- EF Core CLI tools
- Postman or another API client

## Configuration

The API reads PostgreSQL from `MathTutor.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=LucidMathDB;Username=postgres;Password=12345"
}
```

Update the connection string for your local PostgreSQL user before running migrations.

## Commands

Run these from the `backend` folder:

```bash
dotnet clean
dotnet restore
dotnet build
dotnet ef migrations list --project MathTutor.Infrastructure --startup-project MathTutor.API --context ApplicationDbContext
dotnet ef database update --project MathTutor.Infrastructure --startup-project MathTutor.API --context ApplicationDbContext
dotnet run --project MathTutor.API --urls http://localhost:5152
```

## Seed Data

Startup seeding is idempotent and creates:

- Roles: `Student`, `Teacher`, `Admin`
- Development admin: `admin@lucidmath.local` / `Admin12345`
- Topics: Arithmetic, Fractions, Algebra, Geometry
- Eight demo multiple-choice questions

The development admin password is for local demo use only.

## Authentication

- Register: `POST /api/Auth/register`
- Login: `POST /api/Auth/login`
- Copy the returned `token`.
- In Postman, set `Authorization: Bearer <token>`.

JWT tokens include role claims. Student accounts are assigned `Student` on registration. The seeded admin has `Admin`.

## Endpoint Summary

| Method | Route | Role |
| --- | --- | --- |
| POST | `/api/Auth/register` | Public |
| POST | `/api/Auth/login` | Public |
| GET | `/api/profile/me` | Student |
| PUT | `/api/profile/me` | Student |
| GET | `/api/topics` | Student, Admin |
| GET | `/api/topics/{id}` | Student, Admin |
| POST | `/api/topics` | Admin |
| PUT | `/api/topics/{id}` | Admin |
| DELETE | `/api/topics/{id}` | Admin |
| GET | `/api/questions` | Student, Admin |
| GET | `/api/questions/{id}` | Student, Admin |
| GET | `/api/questions/topic/{topicId}` | Student, Admin |
| POST | `/api/questions` | Admin |
| PUT | `/api/questions/{id}` | Admin |
| DELETE | `/api/questions/{id}` | Admin |
| POST | `/api/assessments/start` | Student |
| POST | `/api/assessments/{assessmentId}/submit` | Student |
| GET | `/api/assessments/{assessmentId}` | Student owner, Admin |
| GET | `/api/assessments/my-history` | Student |
| GET | `/api/admin/assessments` | Admin |
| GET | `/api/learner-profile/me` | Student |
| GET | `/api/learner-profile/student/{studentId}` | Admin |
| GET | `/api/learning-history/me` | Student |
| GET | `/api/dashboard/student` | Student |
| GET | `/api/dashboard/admin` | Admin |

Student question and assessment-start responses do not include `CorrectAnswer` or `Explanation`.

## Postman Test Plan

Base URL: `http://localhost:5152`

1. Register a student
   - `POST /api/Auth/register`
   - Role: Public
   - Body:
```json
{
  "fullName": "Test Student",
  "email": "student1@lucidmath.local",
  "password": "Student12345",
  "educationLevel": "JHS"
}
```
   - Expected: `200 OK`, response includes `success: true` and `token`.

2. Login as student
   - `POST /api/Auth/login`
   - Body:
```json
{
  "email": "student1@lucidmath.local",
  "password": "Student12345"
}
```
   - Expected: `200 OK`, copy the Student token.

3. Login as admin
   - `POST /api/Auth/login`
   - Body:
```json
{
  "email": "admin@lucidmath.local",
  "password": "Admin12345"
}
```
   - Expected: `200 OK`, copy the Admin token.

4. Student profile
   - `GET /api/profile/me`, Student token
   - Expected: `200 OK`
   - `PUT /api/profile/me`, Student token
```json
{
  "fullName": "Updated Student",
  "educationLevel": "SHS"
}
```

5. Topics
   - `GET /api/topics`, Student or Admin token, expected `200 OK`.
   - `POST /api/topics`, Admin token:
```json
{
  "name": "Trigonometry",
  "description": "Angles and triangle ratios.",
  "difficultyLevel": "Advanced"
}
```
   - Expected: `201 Created`.

6. Questions
   - `GET /api/questions`, Student token, expected `200 OK` without `correctAnswer`.
   - `POST /api/questions`, Admin token:
```json
{
  "questionText": "What is 2 + 3?",
  "optionA": "4",
  "optionB": "5",
  "optionC": "6",
  "optionD": "7",
  "correctAnswer": "5",
  "explanation": "Two plus three equals five.",
  "difficultyLevel": 1,
  "topicId": 1
}
```
   - Expected: `201 Created`.

7. Start assessment
   - `POST /api/assessments/start`, Student token:
```json
{
  "questionCount": 3,
  "topicId": 1,
  "difficultyLevel": 1
}
```
   - Expected: `200 OK`, response includes `assessmentId` and safe questions.

8. Submit assessment
   - `POST /api/assessments/{assessmentId}/submit`, Student token:
```json
{
  "answers": [
    { "questionId": 1, "selectedAnswer": "45" },
    { "questionId": 2, "selectedAnswer": "54" }
  ]
}
```
   - Expected: `200 OK`, response includes total questions, correct answers, incorrect answers and percentage score.

9. Retrieve assessment result
   - `GET /api/assessments/{assessmentId}`, Student owner or Admin token
   - Expected: `200 OK`; another student receives `403`.

10. Learner profile
   - `GET /api/learner-profile/me`, Student token
   - Expected: `200 OK`, includes mastery, strongest/weakest topic and recommendation.

11. Learning history
   - `GET /api/learning-history/me?page=1&pageSize=10`, Student token
   - Expected: `200 OK`, newest events first.

12. Student dashboard
   - `GET /api/dashboard/student`, Student token
   - Expected: `200 OK`, includes profile summary, assessment stats, recommendation and chart-ready progress data.

13. Admin dashboard
   - `GET /api/dashboard/admin`, Admin token
   - Expected: `200 OK`, includes totals, average score, topic performance and recent assessments.

14. Admin assessments
   - `GET /api/admin/assessments?page=1&pageSize=25`, Admin token
   - Expected: `200 OK`, paged assessment summaries.
