using MathTutor.Application.DTOs.Topics;

namespace MathTutor.Application.Interfaces.Services;

public interface ITopicService
{
    Task<IEnumerable<TopicDto>> GetAllAsync();

    Task<TopicDto?> GetByIdAsync(int id);

    Task<(bool Success, string Message, TopicDto? Data)> CreateAsync(
        CreateTopicDto dto);

    Task<(bool Success, string Message, TopicDto? Data)> UpdateAsync(
        int id,
        UpdateTopicDto dto);

    Task<(bool Success, string Message)> DeleteAsync(int id);
}