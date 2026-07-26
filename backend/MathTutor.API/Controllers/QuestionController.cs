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

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(new
    {
        success = true,
        message = "Questions retrieved successfully.",
        data = await _questionService.GetAllAsync()
    });

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var question = await _questionService.GetByIdAsync(id);
        return question is null
            ? NotFound(new { success = false, message = "Question was not found." })
            : Ok(new { success = true, message = "Question retrieved successfully.", data = question });
    }

    [HttpGet("topic/{topicId:int}")]
    public async Task<IActionResult> GetByTopic(int topicId) => Ok(new
    {
        success = true,
        message = "Topic questions retrieved successfully.",
        data = await _questionService.GetByTopicIdAsync(topicId)
    });

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
    {
        var result = await _questionService.CreateAsync(dto);
        if (!result.Success) return BadRequest(new { success = false, message = result.Message });
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id },
            new { success = true, message = result.Message, data = result.Data });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateQuestionDto dto)
    {
        var result = await _questionService.UpdateAsync(id, dto);
        if (!result.Success) return BadRequest(new { success = false, message = result.Message });
        return Ok(new { success = true, message = result.Message, data = result.Data });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _questionService.DeleteAsync(id);
        return !result.Success
            ? NotFound(new { success = false, message = result.Message })
            : Ok(new { success = true, message = result.Message });
    }
}
