namespace MathTutor.Application.DTOs.Authentication;

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string EducationLevel { get; set; } = string.Empty;
}