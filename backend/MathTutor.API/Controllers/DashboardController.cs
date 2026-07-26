using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MathTutor.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("student")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> StudentDashboard()
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? User.FindFirstValue("email");

        var student = string.IsNullOrWhiteSpace(email)
            ? null
            : await _context.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Email == email);

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        var completedAssessments = await _context.Assessments
            .AsNoTracking()
            .Where(a => a.StudentId == student.Id && a.IsCompleted)
            .OrderByDescending(a => a.DateTaken)
            .ToListAsync();

        var profile = await _context.LearnerProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.StudentId == student.Id);

        var recentHistory = await _context.LearningHistories
            .AsNoTracking()
            .Where(h => h.StudentId == student.Id)
            .OrderByDescending(h => h.DateCompleted)
            .Take(5)
            .Select(h => new
            {
                h.Activity,
                h.EventType,
                h.Performance,
                h.DateCompleted,
                h.AssessmentId,
                h.TopicId
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            message = "Student dashboard retrieved successfully.",
            data = new
            {
                student = new
                {
                    student.Id,
                    student.FullName,
                    student.Email,
                    student.EducationLevel
                },
                completedAssessments = completedAssessments.Count,
                averageScore = completedAssessments.Count == 0 ? 0 : Math.Round(completedAssessments.Average(a => a.Score), 2),
                latestScore = completedAssessments.FirstOrDefault()?.Score ?? 0,
                strongestTopic = profile?.StrongestTopic ?? string.Empty,
                weakestTopic = profile?.WeakestTopic ?? string.Empty,
                recommendedNextTopic = profile?.RecommendedNextTopic ?? string.Empty,
                recentHistory,
                progress = completedAssessments
                    .OrderBy(a => a.DateTaken)
                    .Select(a => new { a.Id, date = a.DateTaken, score = a.Score })
            }
        });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdminDashboard()
    {
        var completedAssessments = _context.Assessments
            .AsNoTracking()
            .Where(a => a.IsCompleted);

        var topicPerformanceRows = await _context.StudentAnswers
            .AsNoTracking()
            .Include(sa => sa.Question)
                .ThenInclude(q => q!.Topic)
            .Where(sa => sa.Question != null && sa.Question.Topic != null)
            .GroupBy(sa => new
            {
                sa.Question!.TopicId,
                TopicName = sa.Question.Topic!.Name
            })
            .Select(g => new
            {
                topicId = g.Key.TopicId,
                topicName = g.Key.TopicName,
                totalAnswers = g.Count(),
                correctAnswers = g.Count(x => x.IsCorrect)
            })
            .ToListAsync();

        var topicPerformance = topicPerformanceRows
            .Select(x => new
            {
                x.topicId,
                x.topicName,
                x.totalAnswers,
                x.correctAnswers,
                averageScore = x.totalAnswers == 0
                    ? 0
                    : Math.Round((double)x.correctAnswers / x.totalAnswers * 100, 2)
            })
            .OrderBy(x => x.averageScore)
            .ToList();

        var recentAssessments = await _context.Assessments
            .AsNoTracking()
            .Include(a => a.Student)
            .Where(a => a.IsCompleted)
            .OrderByDescending(a => a.DateTaken)
            .Take(10)
            .Select(a => new
            {
                a.Id,
                studentName = a.Student == null ? string.Empty : a.Student.FullName,
                percentageScore = a.Score,
                a.TotalQuestions,
                a.DateTaken
            })
            .ToListAsync();

        var mostActiveStudentRows = await _context.Assessments
            .AsNoTracking()
            .Include(a => a.Student)
            .Where(a => a.IsCompleted)
            .GroupBy(a => new { a.StudentId, StudentName = a.Student!.FullName })
            .Select(g => new
            {
                studentId = g.Key.StudentId,
                studentName = g.Key.StudentName,
                completedAssessments = g.Count(),
                averageScore = g.Average(a => a.Score)
            })
            .OrderByDescending(x => x.completedAssessments)
            .Take(5)
            .ToListAsync();

        var mostActiveStudents = mostActiveStudentRows
            .Select(x => new
            {
                x.studentId,
                x.studentName,
                x.completedAssessments,
                averageScore = Math.Round(x.averageScore, 2)
            })
            .ToList();

        return Ok(new
        {
            success = true,
            message = "Admin dashboard retrieved successfully.",
            data = new
            {
                totalStudents = await _context.Students.CountAsync(),
                totalTopics = await _context.Topics.CountAsync(),
                totalQuestions = await _context.Questions.CountAsync(),
                totalCompletedAssessments = await completedAssessments.CountAsync(),
                averageStudentScore = await completedAssessments.AnyAsync()
                    ? Math.Round(await completedAssessments.AverageAsync(a => a.Score), 2)
                    : 0,
                mostDifficultTopic = topicPerformance.FirstOrDefault(),
                mostActiveStudents,
                recentAssessments,
                topicPerformance
            }
        });
    }
}
