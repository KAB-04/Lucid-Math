using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MathTutor.Domain.Entities;
using MathTutor.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/assessments")]
[Authorize]
public class AssessmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AssessmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("availability")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> Availability()
    {
        var availability = await _context.Questions
            .AsNoTracking()
            .GroupBy(q => new { q.TopicId, q.DifficultyLevel })
            .Select(g => new
            {
                g.Key.TopicId,
                g.Key.DifficultyLevel,
                questionCount = g.Count()
            })
            .OrderBy(x => x.TopicId)
            .ThenBy(x => x.DifficultyLevel)
            .ToListAsync();

        return Ok(new
        {
            success = true,
            message = "Assessment availability retrieved successfully.",
            data = availability
        });
    }

    [HttpPost("start")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Start([FromBody] StartAssessmentRequest request)
    {
        var student = await GetCurrentStudentAsync();

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        if (request.TopicId.HasValue)
        {
            var topicExists = await _context.Topics
                .AsNoTracking()
                .AnyAsync(t => t.Id == request.TopicId.Value);

            if (!topicExists)
            {
                return BadRequest(new { success = false, message = "The selected topic could not be found." });
            }
        }

        if (request.DifficultyLevel.HasValue &&
            (request.DifficultyLevel.Value < 1 || request.DifficultyLevel.Value > 3))
        {
            return BadRequest(new { success = false, message = "Difficulty level must be between 1 and 3." });
        }

        var questionQuery = _context.Questions
            .AsNoTracking()
            .Include(q => q.Topic)
            .AsQueryable();

        if (request.TopicId.HasValue)
        {
            questionQuery = questionQuery.Where(q => q.TopicId == request.TopicId.Value);
        }

        if (request.DifficultyLevel.HasValue)
        {
            questionQuery = questionQuery.Where(q => q.DifficultyLevel == request.DifficultyLevel.Value);
        }

        var availableQuestions = await questionQuery.ToListAsync();
        var questionCount = request.QuestionCount <= 0 ? 10 : Math.Min(request.QuestionCount, 50);

        if (availableQuestions.Count == 0)
        {
            var anyQuestionsExist = await _context.Questions.AsNoTracking().AnyAsync();

            if (!anyQuestionsExist)
            {
                return BadRequest(new { success = false, message = "No questions are available yet." });
            }

            if (request.TopicId.HasValue && request.DifficultyLevel.HasValue)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "No questions are available for the selected topic and difficulty."
                });
            }

            if (request.TopicId.HasValue)
            {
                return BadRequest(new { success = false, message = "No questions are available for the selected topic." });
            }

            if (request.DifficultyLevel.HasValue)
            {
                return BadRequest(new { success = false, message = "No questions are available for the selected difficulty." });
            }

            return BadRequest(new { success = false, message = "No questions are available for this assessment request." });
        }

        if (availableQuestions.Count < questionCount)
        {
            return BadRequest(new
            {
                success = false,
                message = $"Only {availableQuestions.Count} question(s) are available for this assessment request."
            });
        }

        var selectedQuestions = availableQuestions
            .OrderBy(_ => Guid.NewGuid())
            .Take(questionCount)
            .ToList();

        var assessment = new Assessment
        {
            StudentId = student.Id,
            TopicId = request.TopicId,
            DifficultyLevel = request.DifficultyLevel,
            TotalQuestions = selectedQuestions.Count,
            IsCompleted = false,
            Score = 0
        };

        for (var index = 0; index < selectedQuestions.Count; index++)
        {
            assessment.AssessmentQuestions.Add(new AssessmentQuestion
            {
                QuestionId = selectedQuestions[index].Id,
                Order = index + 1
            });
        }

        _context.Assessments.Add(assessment);
        _context.LearningHistories.Add(new LearningHistory
        {
            StudentId = student.Id,
            Activity = "Assessment started",
            EventType = "AssessmentStarted",
            TopicId = request.TopicId,
            Performance = 0,
            DateCompleted = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Assessment started successfully.",
            data = new
            {
                assessment.Id,
                assessment.TotalQuestions,
                questions = selectedQuestions.Select(ToSafeQuestion)
            }
        });
    }

    [HttpPost("{assessmentId:int}/submit")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Submit(
        int assessmentId,
        [FromBody] SubmitAssessmentRequest request)
    {
        var student = await GetCurrentStudentAsync();

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        var assessment = await _context.Assessments
            .Include(a => a.AssessmentQuestions)
                .ThenInclude(aq => aq.Question)
                    .ThenInclude(q => q!.Topic)
            .Include(a => a.StudentAnswers)
            .FirstOrDefaultAsync(a => a.Id == assessmentId);

        if (assessment == null)
        {
            return NotFound(new { success = false, message = "Assessment was not found." });
        }

        if (assessment.StudentId != student.Id)
        {
            return Forbid();
        }

        if (assessment.IsCompleted)
        {
            return BadRequest(new { success = false, message = "Assessment has already been submitted." });
        }

        var submittedAnswers = request.Answers
            .ToDictionary(a => a.QuestionId, a => a.SelectedAnswer?.Trim() ?? string.Empty);

        var answerResults = new List<object>();
        var correctAnswers = 0;

        foreach (var assessmentQuestion in assessment.AssessmentQuestions.OrderBy(aq => aq.Order))
        {
            var question = assessmentQuestion.Question!;
            submittedAnswers.TryGetValue(question.Id, out var selectedAnswer);

            var isCorrect = string.Equals(
                selectedAnswer,
                question.CorrectAnswer,
                StringComparison.OrdinalIgnoreCase);

            if (isCorrect)
            {
                correctAnswers++;
            }

            assessment.StudentAnswers.Add(new StudentAnswer
            {
                AssessmentId = assessment.Id,
                QuestionId = question.Id,
                SelectedAnswer = selectedAnswer ?? string.Empty,
                IsCorrect = isCorrect
            });

            answerResults.Add(new
            {
                question.Id,
                question.QuestionText,
                selectedAnswer,
                question.CorrectAnswer,
                isCorrect,
                question.Explanation,
                topicId = question.TopicId,
                topicName = question.Topic?.Name ?? string.Empty,
                question.DifficultyLevel
            });
        }

        assessment.CorrectAnswers = correctAnswers;
        assessment.IncorrectAnswers = assessment.TotalQuestions - correctAnswers;
        assessment.Score = assessment.TotalQuestions == 0
            ? 0
            : Math.Round((double)correctAnswers / assessment.TotalQuestions * 100, 2);
        assessment.IsCompleted = true;
        assessment.DateTaken = DateTime.UtcNow;

        await UpdateLearnerProfileAsync(student.Id, assessment);

        _context.LearningHistories.Add(new LearningHistory
        {
            StudentId = student.Id,
            AssessmentId = assessment.Id,
            TopicId = assessment.TopicId,
            Activity = $"Assessment completed with {assessment.Score}%",
            EventType = "AssessmentCompleted",
            Performance = assessment.Score,
            DateCompleted = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Assessment submitted successfully.",
            data = BuildAssessmentResult(assessment, answerResults)
        });
    }

    [HttpGet("{assessmentId:int}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> GetById(int assessmentId)
    {
        var assessment = await _context.Assessments
            .AsNoTracking()
            .Include(a => a.Student)
            .Include(a => a.StudentAnswers)
                .ThenInclude(sa => sa.Question)
                    .ThenInclude(q => q!.Topic)
            .FirstOrDefaultAsync(a => a.Id == assessmentId);

        if (assessment == null)
        {
            return NotFound(new { success = false, message = "Assessment was not found." });
        }

        if (!User.IsInRole("Admin"))
        {
            var student = await GetCurrentStudentAsync();

            if (student == null || assessment.StudentId != student.Id)
            {
                return Forbid();
            }
        }

        return Ok(new
        {
            success = true,
            message = "Assessment retrieved successfully.",
            data = ToAssessmentSummary(assessment)
        });
    }

    [HttpGet("my-history")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> MyHistory()
    {
        var student = await GetCurrentStudentAsync();

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        var assessments = await _context.Assessments
            .AsNoTracking()
            .Where(a => a.StudentId == student.Id)
            .OrderByDescending(a => a.StartedAt)
            .Select(a => new
            {
                a.Id,
                a.StartedAt,
                a.DateTaken,
                a.IsCompleted,
                a.TotalQuestions,
                a.CorrectAnswers,
                a.IncorrectAnswers,
                percentageScore = a.Score,
                a.TopicId,
                a.DifficultyLevel
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            message = "Assessment history retrieved successfully.",
            data = assessments
        });
    }

    private async Task<Student?> GetCurrentStudentAsync()
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
    }

    private async Task UpdateLearnerProfileAsync(int studentId, Assessment assessment)
    {
        var answers = assessment.StudentAnswers
            .Where(sa => sa.Question?.Topic != null)
            .ToList();

        var topicPerformance = answers
            .GroupBy(sa => sa.Question!.Topic!.Name)
            .Select(g => new
            {
                Topic = g.Key,
                Score = g.Count() == 0 ? 0 : (double)g.Count(a => a.IsCorrect) / g.Count() * 100
            })
            .OrderBy(x => x.Score)
            .ToList();

        var weakestTopic = topicPerformance.FirstOrDefault()?.Topic ?? string.Empty;
        var strongestTopic = topicPerformance.LastOrDefault()?.Topic ?? string.Empty;

        var profile = await _context.LearnerProfiles
            .FirstOrDefaultAsync(p => p.StudentId == studentId);

        if (profile == null)
        {
            profile = new LearnerProfile { StudentId = studentId };
            _context.LearnerProfiles.Add(profile);
        }

        profile.OverallMastery = assessment.Score;
        profile.StrongestTopic = strongestTopic;
        profile.WeakestTopic = weakestTopic;
        profile.Strengths = strongestTopic;
        profile.Weaknesses = weakestTopic;
        profile.RecommendedNextTopic = string.IsNullOrWhiteSpace(weakestTopic)
            ? strongestTopic
            : weakestTopic;
        profile.RecommendedDifficultyLevel = assessment.Score < 40
            ? 1
            : assessment.Score < 70 ? 2 : 3;
        profile.TeachingApproach = assessment.Score < 40
            ? "Foundation level; recommend simpler explanations and worked examples."
            : assessment.Score < 70
                ? "Developing level; recommend guided practice and visual explanations."
                : "Proficient level; recommend challenging practice and problem-solving.";
        profile.LearningPreference = profile.TeachingApproach;
        profile.LastUpdated = DateTime.UtcNow;

        _context.LearningHistories.Add(new LearningHistory
        {
            StudentId = studentId,
            AssessmentId = assessment.Id,
            TopicId = assessment.TopicId,
            Activity = "Learner profile updated",
            EventType = "LearnerProfileUpdated",
            Performance = assessment.Score,
            DateCompleted = DateTime.UtcNow
        });
    }

    private static object ToSafeQuestion(Question question)
    {
        return new
        {
            question.Id,
            question.QuestionText,
            question.OptionA,
            question.OptionB,
            question.OptionC,
            question.OptionD,
            question.DifficultyLevel,
            question.TopicId,
            topicName = question.Topic?.Name ?? string.Empty
        };
    }

    private static object BuildAssessmentResult(Assessment assessment, IEnumerable<object> answers)
    {
        return new
        {
            assessment.Id,
            assessment.TotalQuestions,
            assessment.CorrectAnswers,
            assessment.IncorrectAnswers,
            percentageScore = assessment.Score,
            assessment.IsCompleted,
            submittedAt = assessment.DateTaken,
            answers
        };
    }

    private static object ToAssessmentSummary(Assessment assessment)
    {
        return new
        {
            assessment.Id,
            studentId = assessment.StudentId,
            studentName = assessment.Student?.FullName ?? string.Empty,
            assessment.StartedAt,
            assessment.DateTaken,
            assessment.IsCompleted,
            assessment.TotalQuestions,
            assessment.CorrectAnswers,
            assessment.IncorrectAnswers,
            percentageScore = assessment.Score,
            answers = assessment.StudentAnswers.Select(sa => new
            {
                sa.QuestionId,
                questionText = sa.Question?.QuestionText ?? string.Empty,
                sa.SelectedAnswer,
                sa.IsCorrect,
                topicId = sa.Question?.TopicId,
                topicName = sa.Question?.Topic?.Name ?? string.Empty,
                difficultyLevel = sa.Question?.DifficultyLevel
            })
        };
    }
}

public class StartAssessmentRequest
{
    public int? TopicId { get; set; }

    public int? DifficultyLevel { get; set; }

    public int QuestionCount { get; set; } = 10;
}

public class SubmitAssessmentRequest
{
    public List<SubmitAnswerRequest> Answers { get; set; } = new();
}

public class SubmitAnswerRequest
{
    public int QuestionId { get; set; }

    public string SelectedAnswer { get; set; } = string.Empty;
}
