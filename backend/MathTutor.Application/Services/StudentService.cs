using MathTutor.Application.DTOs.Students;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Domain.Entities;

namespace MathTutor.Application.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;

    public StudentService(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<StudentDto>> GetAllAsync()
    {
        var students = await _studentRepository.GetAllAsync();

        return students.Select(student => new StudentDto
        {
            Id = student.Id,
            FullName = student.FullName,
            Email = student.Email,
            EducationLevel = student.EducationLevel,
            CreatedAt = student.CreatedAt
        });
    }

    public async Task<StudentDto?> GetByIdAsync(int id)
    {
        var student = await _studentRepository.GetByIdAsync(id);

        if (student == null)
            return null;

        return new StudentDto
        {
            Id = student.Id,
            FullName = student.FullName,
            Email = student.Email,
            EducationLevel = student.EducationLevel,
            CreatedAt = student.CreatedAt
        };
    }

    public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
    {
        var student = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            EducationLevel = dto.EducationLevel
        };

        var createdStudent = await _studentRepository.CreateAsync(student);

        return new StudentDto
        {
            Id = createdStudent.Id,
            FullName = createdStudent.FullName,
            Email = createdStudent.Email,
            EducationLevel = createdStudent.EducationLevel,
            CreatedAt = createdStudent.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateStudentDto dto)
    {
        var student = await _studentRepository.GetByIdAsync(id);

        if (student == null)
            return false;

        student.FullName = dto.FullName;
        student.EducationLevel = dto.EducationLevel;

        await _studentRepository.UpdateAsync(student);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var student = await _studentRepository.GetByIdAsync(id);

        if (student == null)
            return false;

        await _studentRepository.DeleteAsync(student);

        return true;
    }

    
}