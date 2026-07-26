using MathTutor.Application.DTOs.Topics;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Domain.Entities;

namespace MathTutor.Application.Services;

public class TopicService : ITopicService
{
    private readonly ITopicRepository _topicRepository;

    public TopicService(ITopicRepository topicRepository)
    {
        _topicRepository = topicRepository;
    }

    public async Task<IEnumerable<TopicDto>> GetAllAsync()
    {
        var topics = await _topicRepository.GetAllAsync();

        return topics.Select(MapToDto);
    }

    public async Task<TopicDto?> GetByIdAsync(int id)
    {
        var topic = await _topicRepository.GetByIdAsync(id);

        return topic == null ? null : MapToDto(topic);
    }

    public async Task<(bool Success, string Message, TopicDto? Data)>
        CreateAsync(CreateTopicDto dto)
    {
        var existingTopic =
            await _topicRepository.GetByNameAsync(dto.Name.Trim());

        if (existingTopic != null)
        {
            return (
                false,
                "A topic with this name already exists.",
                null
            );
        }

        var topic = new Topic
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            DifficultyLevel = dto.DifficultyLevel.Trim()
        };

        var createdTopic =
            await _topicRepository.CreateAsync(topic);

        return (
            true,
            "Topic created successfully.",
            MapToDto(createdTopic)
        );
    }

    public async Task<(bool Success, string Message, TopicDto? Data)>
        UpdateAsync(int id, UpdateTopicDto dto)
    {
        var topic = await _topicRepository.GetByIdAsync(id);

        if (topic == null)
        {
            return (
                false,
                "Topic was not found.",
                null
            );
        }

        var topicWithSameName =
            await _topicRepository.GetByNameAsync(dto.Name.Trim());

        if (topicWithSameName != null &&
            topicWithSameName.Id != id)
        {
            return (
                false,
                "Another topic with this name already exists.",
                null
            );
        }

        topic.Name = dto.Name.Trim();
        topic.Description = dto.Description.Trim();
        topic.DifficultyLevel = dto.DifficultyLevel.Trim();

        await _topicRepository.UpdateAsync(topic);

        return (
            true,
            "Topic updated successfully.",
            MapToDto(topic)
        );
    }

    public async Task<(bool Success, string Message)>
        DeleteAsync(int id)
    {
        var topic = await _topicRepository.GetByIdAsync(id);

        if (topic == null)
        {
            return (
                false,
                "Topic was not found."
            );
        }

        await _topicRepository.DeleteAsync(topic);

        return (
            true,
            "Topic deleted successfully."
        );
    }

    private static TopicDto MapToDto(Topic topic)
    {
        return new TopicDto
        {
            Id = topic.Id,
            Name = topic.Name,
            Description = topic.Description,
            DifficultyLevel = topic.DifficultyLevel
        };
    }
}