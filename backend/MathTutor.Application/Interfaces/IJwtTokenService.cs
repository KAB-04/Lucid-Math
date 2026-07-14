using MathTutor.Domain.Identity;

namespace MathTutor.Application.Interfaces.Services;

public interface IJwtTokenService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}