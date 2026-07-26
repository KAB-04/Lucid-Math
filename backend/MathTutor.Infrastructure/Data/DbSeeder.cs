using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MathTutor.Domain.Entities;
using MathTutor.Domain.Identity;

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

    public static async Task SeedDevelopmentData(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        await SeedTopicsAndQuestions(context);
        await SeedDevelopmentAdmin(userManager);
    }

    private static async Task SeedTopicsAndQuestions(
        ApplicationDbContext context)
    {
        var topicSeed = new[]
        {
            new Topic { Name = "Arithmetic", Description = "Whole numbers, operations and number sense.", DifficultyLevel = "Beginner" },
            new Topic { Name = "Fractions", Description = "Equivalent fractions, operations and comparisons.", DifficultyLevel = "Beginner" },
            new Topic { Name = "Algebra", Description = "Variables, expressions and equations.", DifficultyLevel = "Intermediate" },
            new Topic { Name = "Geometry", Description = "Shapes, angles, perimeter and area.", DifficultyLevel = "Intermediate" }
        };

        foreach (var topic in topicSeed)
        {
            if (!await context.Topics.AnyAsync(t => t.Name == topic.Name))
            {
                context.Topics.Add(topic);
            }
        }

        await context.SaveChangesAsync();

        var topics = await context.Topics.ToDictionaryAsync(t => t.Name, t => t.Id);

        var questions = new[]
        {
            CreateQuestion("Arithmetic", "What is 18 + 27?", "35", "45", "54", "40", "45", "Add ones first, then tens.", 1, topics),
            CreateQuestion("Arithmetic", "What is 9 x 6?", "42", "48", "54", "63", "54", "Nine groups of six equals fifty-four.", 1, topics),
            CreateQuestion("Fractions", "Which fraction is equivalent to 1/2?", "2/3", "2/4", "3/5", "4/6", "2/4", "Multiplying numerator and denominator by 2 gives 2/4.", 1, topics),
            CreateQuestion("Fractions", "What is 1/4 + 1/4?", "1/8", "1/2", "2/8", "1/4", "1/2", "One quarter plus one quarter is two quarters, or one half.", 1, topics),
            CreateQuestion("Algebra", "If x + 5 = 12, what is x?", "5", "7", "12", "17", "7", "Subtract 5 from both sides.", 2, topics),
            CreateQuestion("Algebra", "Simplify 3a + 2a.", "5a", "6a", "a", "5", "5a", "Combine like terms.", 2, topics),
            CreateQuestion("Geometry", "How many degrees are in a right angle?", "45", "60", "90", "180", "90", "A right angle measures ninety degrees.", 1, topics),
            CreateQuestion("Geometry", "What is the perimeter of a square with side 5 cm?", "10 cm", "20 cm", "25 cm", "15 cm", "20 cm", "A square has four equal sides, so 4 x 5 = 20.", 2, topics)
        };

        foreach (var question in questions)
        {
            if (!await context.Questions.AnyAsync(q =>
                q.QuestionText == question.QuestionText &&
                q.TopicId == question.TopicId))
            {
                context.Questions.Add(question);
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedDevelopmentAdmin(
        UserManager<ApplicationUser> userManager)
    {
        const string email = "admin@lucidmath.local";
        const string password = "Admin12345";

        var admin = await userManager.FindByEmailAsync(email);

        if (admin == null)
        {
            admin = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FullName = "Development Admin",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, password);

            if (!result.Succeeded)
            {
                return;
            }
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }

    private static Question CreateQuestion(
        string topicName,
        string text,
        string optionA,
        string optionB,
        string optionC,
        string optionD,
        string correctAnswer,
        string explanation,
        int difficultyLevel,
        Dictionary<string, int> topics)
    {
        return new Question
        {
            TopicId = topics[topicName],
            QuestionText = text,
            OptionA = optionA,
            OptionB = optionB,
            OptionC = optionC,
            OptionD = optionD,
            CorrectAnswer = correctAnswer,
            Explanation = explanation,
            DifficultyLevel = difficultyLevel
        };
    }
}
