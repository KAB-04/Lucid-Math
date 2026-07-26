using System.Security.Claims;
using MathTutor.Application.DTOs.Students;
using MathTutor.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize(Roles = "Student")]
public class StudentProfileController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentProfileController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    // GET: api/profile/me
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
                    ?? User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new
            {
                success = false,
                message = "The authenticated user's email could not be found."
            });
        }

        var student = await _studentService.GetByEmailAsync(email);

        if (student == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile was not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Student profile retrieved successfully.",
            data = student
        });
    }

    // PUT: api/profile/me
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(
        [FromBody] UpdateStudentDto dto)
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
                    ?? User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new
            {
                success = false,
                message = "The authenticated user's email could not be found."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            return BadRequest(new
            {
                success = false,
                message = "Full name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.EducationLevel))
        {
            return BadRequest(new
            {
                success = false,
                message = "Education level is required."
            });
        }

        var updated = await _studentService.UpdateByEmailAsync(email, dto);

        if (!updated)
        {
            return NotFound(new
            {
                success = false,
                message = "Student profile was not found."
            });
        }

        var updatedProfile = await _studentService.GetByEmailAsync(email);

        return Ok(new
        {
            success = true,
            message = "Student profile updated successfully.",
            data = updatedProfile
        });
    }
}