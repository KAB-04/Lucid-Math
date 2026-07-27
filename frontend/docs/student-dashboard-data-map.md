# Student Dashboard Data Map

## Endpoints Used

- `GET /api/dashboard/student`
  - Supplies student identity, completed assessment count, average score, latest score, strongest topic, weakest topic, recommended next topic, recent history, and assessment progress.
- `GET /api/learner-profile/me`
  - Supplies overall mastery, recommended difficulty level, teaching approach, last updated date, and learner-profile recommendation fields.
- `GET /api/learning-history/me?page=1&pageSize=5`
  - Supplies recent learning activity with topic names where available.
- `GET /api/assessments/my-history`
  - Supplies assessment history records used to validate completed assessment state.

## Dashboard Sections

- Welcome header: auth state plus `dashboard.student`.
- Summary cards: `completedAssessments`, `averageScore`, `latestScore`, and `learner-profile.overallMasteryPercentage`.
- Recommended next step: `learner-profile.recommendedNextTopic`, `recommendedDifficultyLevel`, `teachingApproach`, and `weakestTopic`.
- Topic performance: learner profile strongest/weakest topic fields. If those fields are empty, the dashboard shows an empty state.
- Assessment progress: `dashboard.progress`. If fewer than two completed assessments exist, the dashboard shows an early-progress state.
- Strengths and weaknesses: learner profile strongest/weakest topic fields, falling back to dashboard values.
- Recent activity: `learning-history/me`, falling back to `dashboard.recentHistory`.
- Quick actions: centralized frontend student routes. These route to existing foundation placeholders until future phases implement the full screens.

No fake analytics are used.
