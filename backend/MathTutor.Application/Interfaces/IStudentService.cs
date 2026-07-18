using MathTutor.Application.DTOs.Students;

namespace MathTutor.Application.Interfaces.Services;

public interface IStudentService
{
    Task<IEnumerable<StudentDto>> GetAllAsync();

    Task<StudentDto?> GetByIdAsync(int id);

    Task<StudentDto?> GetByEmailAsync(string email);

    Task<StudentDto> CreateAsync(CreateStudentDto dto);

    Task<bool> UpdateAsync(int id, UpdateStudentDto dto);

    Task<bool> UpdateByEmailAsync(
        string email,
        UpdateStudentDto dto);

    Task<bool> DeleteAsync(int id);
}