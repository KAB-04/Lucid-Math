using MathTutor.Application.DTOs.Questions;

namespace MathTutor.Application.Interfaces.Services;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDto>> GetAllAsync();

    Task<QuestionDto?> GetByIdAsync(int id);

    Task<IEnumerable<QuestionDto>> GetByTopicIdAsync(int topicId);

    Task<(bool Success, string Message, QuestionDto? Data)> CreateAsync(
        CreateQuestionDto dto);

    Task<(bool Success, string Message, QuestionDto? Data)> UpdateAsync(
        int id,
        UpdateQuestionDto dto);

    Task<(bool Success, string Message)> DeleteAsync(int id);
}
