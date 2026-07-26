using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.Infrastructure.Repositories;

public class QuestionRepository : IQuestionRepository
{
    private readonly ApplicationDbContext _context;

    public QuestionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Question>> GetAllAsync()
    {
        return await _context.Questions
            .AsNoTracking()
            .Include(q => q.Topic)
            .OrderBy(q => q.Topic!.Name)
            .ThenBy(q => q.DifficultyLevel)
            .ThenBy(q => q.Id)
            .ToListAsync();
    }

    public async Task<Question?> GetByIdAsync(int id)
    {
        return await _context.Questions
            .Include(q => q.Topic)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<IEnumerable<Question>> GetByTopicIdAsync(int topicId)
    {
        return await _context.Questions
            .AsNoTracking()
            .Include(q => q.Topic)
            .Where(q => q.TopicId == topicId)
            .OrderBy(q => q.DifficultyLevel)
            .ThenBy(q => q.Id)
            .ToListAsync();
    }

    public async Task<Question> CreateAsync(Question question)
    {
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return question;
    }

    public async Task UpdateAsync(Question question)
    {
        _context.Questions.Update(question);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Question question)
    {
        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();
    }
}
