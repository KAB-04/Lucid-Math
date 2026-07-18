using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MathTutor.Application.DTOs.Students;
using MathTutor.Application.Interfaces.Services;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Teacher")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    // GET: api/student
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _studentService.GetAllAsync();
        return Ok(students);
    }

    // GET: api/student/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _studentService.GetByIdAsync(id);

        if (student == null)
            return NotFound(new
            {
                Message = $"Student with ID {id} was not found."
            });

        return Ok(student);
    }

    // POST: api/student
    [HttpPost]
    public async Task<IActionResult> Create(CreateStudentDto dto)
    {
        var student = await _studentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = student.Id },
            student);
    }

    // PUT: api/student/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateStudentDto dto)
    {
        var updated = await _studentService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound(new
            {
                Message = $"Student with ID {id} was not found."
            });

        return NoContent();
    }

    // DELETE: api/student/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _studentService.DeleteAsync(id);

        if (!deleted)
            return NotFound(new
            {
                Message = $"Student with ID {id} was not found."
            });

        return NoContent();
    }
}