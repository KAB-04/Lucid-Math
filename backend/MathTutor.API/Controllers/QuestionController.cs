using MathTutor.Application.DTOs.Questions;
using MathTutor.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/questions")]
[Authorize]
public class QuestionController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    // GET: api/questions
    [HttpGet]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var questions = await _questionService.GetAllAsync();

        return Ok(new
        {
            success = true,
            message = "Questions retrieved successfully.",
            data = User.IsInRole("Admin")
                ? questions
                : questions.Select(ToSafeQuestion)
        });
    }

    // GET: api/questions/1
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var question = await _questionService.GetByIdAsync(id);

        if (question == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Question was not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Question retrieved successfully.",
            data = User.IsInRole("Admin")
                ? question
                : ToSafeQuestion(question)
        });
    }

    // GET: api/questions/topic/1
    [HttpGet("topic/{topicId:int}")]
    [Authorize(Roles = "Student,Admin")]
    public async Task<IActionResult> GetByTopic(int topicId)
    {
        var questions = await _questionService.GetByTopicIdAsync(topicId);

        return Ok(new
        {
            success = true,
            message = "Questions retrieved successfully.",
            data = User.IsInRole("Admin")
                ? questions
                : questions.Select(ToSafeQuestion)
        });
    }

    // POST: api/questions
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateQuestionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _questionService.CreateAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Data!.Id },
            new
            {
                success = true,
                message = result.Message,
                data = result.Data
            });
    }

    // PUT: api/questions/1
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateQuestionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _questionService.UpdateAsync(id, dto);

        if (!result.Success)
        {
            if (result.Message.Contains(
                "not found",
                StringComparison.OrdinalIgnoreCase))
            {
                return NotFound(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message,
            data = result.Data
        });
    }

    // DELETE: api/questions/1
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _questionService.DeleteAsync(id);

        if (!result.Success)
        {
            return NotFound(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            message = result.Message
        });
    }

    private static object ToSafeQuestion(QuestionDto question)
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
            question.TopicName
        };
    }
}
