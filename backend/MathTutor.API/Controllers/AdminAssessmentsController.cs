using MathTutor.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/admin/assessments")]
[Authorize(Roles = "Admin")]
public class AdminAssessmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminAssessmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(int page = 1, int pageSize = 25)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var assessments = await _context.Assessments
            .AsNoTracking()
            .Include(a => a.Student)
            .OrderByDescending(a => a.DateTaken)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                studentId = a.StudentId,
                studentName = a.Student!.FullName,
                a.IsCompleted,
                a.TotalQuestions,
                a.CorrectAnswers,
                a.IncorrectAnswers,
                percentageScore = a.Score,
                a.TopicId,
                a.DifficultyLevel,
                a.StartedAt,
                a.DateTaken
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            message = "Assessments retrieved successfully.",
            data = assessments
        });
    }
}
