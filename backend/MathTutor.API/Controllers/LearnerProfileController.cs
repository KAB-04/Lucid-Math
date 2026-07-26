using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MathTutor.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/learner-profile")]
[Authorize]
public class LearnerProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LearnerProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMine()
    {
        var student = await GetCurrentStudentAsync();

        if (student == null)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        var profile = await _context.LearnerProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.StudentId == student.Id);

        return Ok(new
        {
            success = true,
            message = "Learner profile retrieved successfully.",
            data = ToProfile(profile, student.Id)
        });
    }

    [HttpGet("student/{studentId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetForStudent(int studentId)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId);

        if (!studentExists)
        {
            return NotFound(new { success = false, message = "Student profile was not found." });
        }

        var profile = await _context.LearnerProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.StudentId == studentId);

        return Ok(new
        {
            success = true,
            message = "Learner profile retrieved successfully.",
            data = ToProfile(profile, studentId)
        });
    }

    private async Task<Domain.Entities.Student?> GetCurrentStudentAsync()
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? User.FindFirstValue("email");

        return string.IsNullOrWhiteSpace(email)
            ? null
            : await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
    }

    private static object ToProfile(Domain.Entities.LearnerProfile? profile, int studentId)
    {
        return new
        {
            studentId,
            overallMasteryPercentage = profile?.OverallMastery ?? 0,
            strongestTopic = profile?.StrongestTopic ?? string.Empty,
            weakestTopic = profile?.WeakestTopic ?? string.Empty,
            recommendedDifficultyLevel = profile?.RecommendedDifficultyLevel ?? 1,
            recommendedNextTopic = profile?.RecommendedNextTopic ?? string.Empty,
            teachingApproach = profile?.TeachingApproach ?? "Complete an assessment to generate a learner profile.",
            lastUpdated = profile?.LastUpdated
        };
    }
}
