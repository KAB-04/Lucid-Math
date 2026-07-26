using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MathTutor.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/learning-history")]
[Authorize(Roles = "Student")]
public class LearningHistoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LearningHistoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine(
        int? topicId,
        DateTime? fromDate,
        DateTime? toDate,
        int page = 1,
        int pageSize = 25)
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? User.FindFirstValue("email");

        var student = string.IsNullOrWhiteSpace(email)
            ? null
            : await _context.Students.FirstOrDefaultAsync(s => s.Email == email);

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.LearningHistories
            .AsNoTracking()
            .Include(h => h.Topic)
            .Where(h => h.StudentId == student.Id);

        if (topicId.HasValue)
        {
            query = query.Where(h => h.TopicId == topicId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(h => h.DateCompleted >= fromDate.Value.ToUniversalTime());
        }

        if (toDate.HasValue)
        {
            query = query.Where(h => h.DateCompleted <= toDate.Value.ToUniversalTime());
        }

        var history = await query
            .OrderByDescending(h => h.DateCompleted)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(h => new
            {
                h.Id,
                h.Activity,
                h.EventType,
                h.Performance,
                h.DateCompleted,
                h.TopicId,
                topicName = h.Topic == null ? string.Empty : h.Topic.Name,
                h.AssessmentId
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            message = "Learning history retrieved successfully.",
            data = history
        });
    }
}
