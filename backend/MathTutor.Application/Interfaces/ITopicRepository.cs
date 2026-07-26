using MathTutor.Domain.Entities;

namespace MathTutor.Application.Interfaces.Repositories;

public interface ITopicRepository
{
    Task<IEnumerable<Topic>> GetAllAsync();

    Task<Topic?> GetByIdAsync(int id);

    Task<Topic?> GetByNameAsync(string name);

    Task<Topic> CreateAsync(Topic topic);

    Task UpdateAsync(Topic topic);

    Task DeleteAsync(Topic topic);
}