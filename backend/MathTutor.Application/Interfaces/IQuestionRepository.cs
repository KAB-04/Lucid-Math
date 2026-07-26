using MathTutor.Domain.Entities;

namespace MathTutor.Application.Interfaces.Repositories;

public interface IQuestionRepository
{
    Task<IEnumerable<Question>> GetAllAsync();
    Task<Question?> GetByIdAsync(int id);
    Task<IEnumerable<Question>> GetByTopicIdAsync(int topicId);
    Task<Question> CreateAsync(Question question);
    Task UpdateAsync(Question question);
    Task DeleteAsync(Question question);
}
