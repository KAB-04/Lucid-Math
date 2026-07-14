namespace MathTutor.Application.DTOs.Students;

public class CreateStudentDto
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string EducationLevel { get; set; } = string.Empty;
}