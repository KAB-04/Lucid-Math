using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MathTutor.Application.DTOs.Students;
using MathTutor.Application.Interfaces.Services;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Student")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(
        IStudentService studentService,
        ILogger<StudentsController> logger)
    {
        _studentService = studentService;
        _logger = logger;
    }

    // GET: api/students
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetAll()
    {
        _logger.LogInformation("Retrieving all students.");

        var students = await _studentService.GetAllAsync();

        return Ok(students);
    }

    // GET: api/students/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<StudentDto>> GetById(int id)
    {
        _logger.LogInformation("Retrieving student with Id {Id}", id);

        var student = await _studentService.GetByIdAsync(id);

        if (student == null)
            return NotFound(new
            {
                message = $"Student with Id {id} was not found."
            });

        return Ok(student);
    }

    // POST: api/students
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentDto>> Create(CreateStudentDto dto)
    {
        _logger.LogInformation("Creating a new student.");

        var createdStudent = await _studentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdStudent.Id },
            createdStudent);
    }

    // PUT: api/students/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateStudentDto dto)
    {
        _logger.LogInformation("Updating student {Id}", id);

        var updated = await _studentService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound(new
            {
                message = $"Student with Id {id} was not found."
            });

        return NoContent();
    }

    // DELETE: api/students/5
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting student {Id}", id);

        var deleted = await _studentService.DeleteAsync(id);

        if (!deleted)
            return NotFound(new
            {
                message = $"Student with Id {id} was not found."
            });

        return NoContent();
    }
}