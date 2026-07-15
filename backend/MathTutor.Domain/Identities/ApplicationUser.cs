using Microsoft.AspNetCore.Identity;
using MathTutor.Domain.Entities;

namespace MathTutor.Domain.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public Student? Student { get; set; }
}
