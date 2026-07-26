using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Domain.Entities;
using MathTutor.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MathTutor.Infrastructure.Repositories;

public class TopicRepository : ITopicRepository
{
    private readonly ApplicationDbContext _context;

    public TopicRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Topic>> GetAllAsync()
    {
        return await _context.Topics
            .AsNoTracking()
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Topic?> GetByIdAsync(int id)
    {
        return await _context.Topics
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Topic?> GetByNameAsync(string name)
    {
        return await _context.Topics
            .FirstOrDefaultAsync(t =>
                t.Name.ToLower() == name.ToLower());
    }

    public async Task<Topic> CreateAsync(Topic topic)
    {
        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();

        return topic;
    }

    public async Task UpdateAsync(Topic topic)
    {
        _context.Topics.Update(topic);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Topic topic)
    {
        _context.Topics.Remove(topic);
        await _context.SaveChangesAsync();
    }
}