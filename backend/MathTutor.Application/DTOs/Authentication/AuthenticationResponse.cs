namespace MathTutor.Application.DTOs.Authentication;

public class AuthenticationResponse
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public string? Token { get; set; }

    public DateTime Expires { get; set; }
}