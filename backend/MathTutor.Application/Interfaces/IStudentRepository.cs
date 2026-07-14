using MathTutor.Domain.Entities;

namespace MathTutor.Application.Interfaces.Repositories;

public interface IStudentRepository
{
    Task<IEnumerable<Student>> GetAllAsync();

    Task<Student?> GetByIdAsync(int id);

    Task<Student> CreateAsync(Student student);

    Task UpdateAsync(Student student);

    Task DeleteAsync(Student student);
    
    Task<Student?> GetByEmailAsync(string email);
}