using MathTutor.Application.DTOs.Authentication;

namespace MathTutor.Application.Interfaces.Services;

public interface IAuthenticationService
{
    Task<AuthenticationResponse> RegisterAsync(RegisterRequest request);

    Task<AuthenticationResponse> LoginAsync(LoginRequest request);
}