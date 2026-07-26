using MathTutor.Application.DTOs.Topics;
using MathTutor.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MathTutor.API.Controllers;

[ApiController]
[Route("api/topics")]
[Authorize]
public class TopicController : ControllerBase
{
    private readonly ITopicService _topicService;

    public TopicController(ITopicService topicService)
    {
        _topicService = topicService;
    }

    // GET: api/topics
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var topics = await _topicService.GetAllAsync();

        return Ok(new
        {
            success = true,
            message = "Topics retrieved successfully.",
            data = topics
        });
    }

    // GET: api/topics/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var topic = await _topicService.GetByIdAsync(id);

        if (topic == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Topic was not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Topic retrieved successfully.",
            data = topic
        });
    }

    // POST: api/topics
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateTopicDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _topicService.CreateAsync(dto);

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

    // PUT: api/topics/1
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateTopicDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _topicService.UpdateAsync(id, dto);

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
            message = result.Message,
            data = result.Data
        });
    }

    // DELETE: api/topics/1
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _topicService.DeleteAsync(id);

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
}