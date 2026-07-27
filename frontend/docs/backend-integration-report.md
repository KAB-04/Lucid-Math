# Lucid Math Frontend Integration Report

## Base URL

- Backend launch profiles:
  - HTTP: `http://localhost:5152`
  - HTTPS: `https://localhost:7171;http://localhost:5152`
- Frontend default API base URL: `https://localhost:7171/api`
- API prefix: `/api`
- CORS status: no CORS policy was found in `Program.cs`. Browser calls from Vite may be blocked until the backend explicitly allows the frontend origin.

## Authentication

Controller route: `api/[controller]`, controller name `AuthController`, so endpoints are:

- `POST /api/Auth/register`
- `POST /api/Auth/login`

`RegisterRequest` body:

```json
{
  "FullName": "string",
  "Email": "string",
  "Password": "string",
  "EducationLevel": "string"
}
```

`LoginRequest` body:

```json
{
  "Email": "string",
  "Password": "string"
}
```

`AuthenticationResponse` body:

```json
{
  "Success": true,
  "Message": "string",
  "Token": "string",
  "Expires": "2026-07-27T00:00:00Z"
}
```

- Token property name: `Token`
- Auth response success property: `Success`
- Auth response message property: `Message`
- No `role`, `roles`, or `user` property is returned by auth endpoints.
- Frontend derives the authenticated user and role from JWT claims.

## Roles And Claims

Backend role values:

- `Student`
- `Admin`

Seed data also creates `Teacher`, and `StudentController` authorizes `Admin,Teacher`, but the frontend uses `Admin` for teacher-facing authorization per project instruction.

JWT claims:

- `sub`: Identity user id
- `email`: user email
- `jti`: token id
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`: full name
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`: backend role

Frontend display mapping:

- `Student` -> `Student`
- `Admin` -> `Teacher`

## Response Wrappers

Most newer API controllers return:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Exceptions:

- Auth endpoints return `Success`, `Message`, `Token`, `Expires`.
- Legacy `StudentController` returns raw student DTO arrays/objects for successful reads and capitalized `Message` for some not-found responses.
- ASP.NET Core validation can return standard validation problem details with `title`, `status`, and `errors`.

## Existing Routes

- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/topics`
- `GET /api/topics/{id}`
- `POST /api/topics` requires `Admin`
- `PUT /api/topics/{id}` requires `Admin`
- `DELETE /api/topics/{id}` requires `Admin`
- `GET /api/questions`
- `GET /api/questions/{id}`
- `GET /api/questions/topic/{topicId}`
- `POST /api/questions` requires `Admin`
- `PUT /api/questions/{id}` requires `Admin`
- `DELETE /api/questions/{id}` requires `Admin`
- `POST /api/assessments/start` requires `Student`
- `POST /api/assessments/{assessmentId}/submit` requires `Student`
- `GET /api/assessments/{assessmentId}` requires `Student` or `Admin`
- `GET /api/assessments/my-history` requires `Student`
- `GET /api/admin/assessments` requires `Admin`
- `GET /api/learner-profile/me` requires `Student`
- `GET /api/learner-profile/student/{studentId}` requires `Admin`
- `GET /api/learning-history/me` requires `Student`
- `GET /api/dashboard/student` requires `Student`
- `GET /api/dashboard/admin` requires `Admin`
- `GET /api/Student` requires `Admin` or `Teacher`
- `GET /api/Student/{id}` requires `Admin` or `Teacher`
- `POST /api/Student` requires `Admin` or `Teacher`
- `PUT /api/Student/{id}` requires `Admin` or `Teacher`
- `DELETE /api/Student/{id}` requires `Admin` or `Teacher`

## Missing Or Deferred Frontend Features

The Phase 2 frontend creates placeholder routes for feature screens that are not fully implemented yet:

- Student topics, assessments, learner profile, learning history, AI tutor, settings
- Teacher topics, questions, assessments, students, analytics, settings

These frontend routes do not call APIs yet, so they do not invent missing backend contracts. No AI tutor backend endpoint was found.
