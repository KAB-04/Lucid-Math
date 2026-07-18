using Microsoft.AspNetCore.Identity;

namespace MathTutor.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedRoles(
        RoleManager<IdentityRole> roleManager)
    {
        string[] roles =
        {
            "Student",
            "Teacher",
            "Admin"
        };


        foreach(var role in roles)
        {
            if(!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(
                    new IdentityRole(role));
            }
        }
    }
}