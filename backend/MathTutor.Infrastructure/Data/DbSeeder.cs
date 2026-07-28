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
            CreateQuestion("Geometry", "What is the perimeter of a square with side 5 cm?", "10 cm", "20 cm", "25 cm", "15 cm", "20 cm", "A square has four equal sides, so 4 x 5 = 20.", 2, topics),
            CreateQuestion("Arithmetic", "What is 15% of 240?", "24", "30", "36", "42", "36", "Ten percent of 240 is 24 and five percent is 12, so fifteen percent is 36.", 3, topics),
            CreateQuestion("Fractions", "What is 3/4 divided by 1/2?", "3/8", "2/3", "1 1/2", "1/4", "1 1/2", "Dividing by one half is the same as multiplying by two.", 3, topics),
            CreateQuestion("Algebra", "Solve 2x - 3 = 11.", "4", "7", "8", "14", "7", "Add 3 to both sides to get 2x = 14, then divide by 2.", 3, topics),
            CreateQuestion("Geometry", "A triangle has angles 45 and 65 degrees. What is the third angle?", "60", "70", "80", "90", "70", "Triangle angles add to 180 degrees, so 180 - 45 - 65 = 70.", 3, topics),
            CreateQuestion("Arithmetic", "What is 64 - 28?", "26", "34", "36", "42", "36", "Regroup ones: 14 - 8 = 6, then 5 - 2 = 3 tens.", 1, topics),
            CreateQuestion("Arithmetic", "What is 144 divided by 12?", "10", "11", "12", "14", "12", "Twelve groups of twelve make one hundred forty-four.", 2, topics),
            CreateQuestion("Arithmetic", "Which number is prime?", "21", "29", "33", "39", "29", "Twenty-nine has no whole-number factors except 1 and itself.", 2, topics),
            CreateQuestion("Arithmetic", "Round 6,487 to the nearest hundred.", "6,400", "6,500", "6,480", "6,000", "6,500", "The tens digit is 8, so the hundreds digit rounds up.", 2, topics),
            CreateQuestion("Arithmetic", "A price rises from 80 to 100. What is the percentage increase?", "20%", "25%", "30%", "40%", "25%", "The increase is 20, and 20 out of 80 is 25%.", 3, topics),
            CreateQuestion("Arithmetic", "Evaluate 3^2 + 4^2.", "12", "18", "25", "49", "25", "Three squared is 9 and four squared is 16, so the sum is 25.", 3, topics),
            CreateQuestion("Fractions", "Which fraction is greater than 1/2?", "3/8", "4/9", "5/8", "2/5", "5/8", "Five eighths is more than four eighths, which equals one half.", 1, topics),
            CreateQuestion("Fractions", "What is 2/3 + 1/6?", "1/2", "5/6", "3/9", "1", "5/6", "Two thirds is four sixths, and four sixths plus one sixth is five sixths.", 2, topics),
            CreateQuestion("Fractions", "What is 5/6 - 1/3?", "1/6", "1/2", "2/3", "4/3", "1/2", "One third is two sixths, so five sixths minus two sixths is three sixths, or one half.", 2, topics),
            CreateQuestion("Fractions", "Simplify 12/18.", "2/3", "3/4", "4/9", "6/9", "2/3", "Divide the numerator and denominator by their greatest common factor, 6.", 2, topics),
            CreateQuestion("Fractions", "What is 2/5 of 35?", "7", "12", "14", "21", "14", "One fifth of 35 is 7, so two fifths is 14.", 3, topics),
            CreateQuestion("Fractions", "Which decimal equals 7/8?", "0.75", "0.8", "0.875", "0.95", "0.875", "Seven divided by eight equals zero point eight seven five.", 3, topics),
            CreateQuestion("Algebra", "If x - 4 = 9, what is x?", "5", "9", "13", "36", "13", "Add 4 to both sides.", 1, topics),
            CreateQuestion("Algebra", "Evaluate 2n when n = 6.", "8", "12", "16", "26", "12", "Substitute 6 for n, then multiply 2 by 6.", 1, topics),
            CreateQuestion("Algebra", "Which expression means three more than x?", "3x", "x + 3", "x - 3", "3 - x", "x + 3", "Three more than x means add 3 to x.", 1, topics),
            CreateQuestion("Algebra", "Solve x/4 = 6.", "2", "10", "18", "24", "24", "Multiply both sides by 4.", 2, topics),
            CreateQuestion("Algebra", "Factor x^2 + 5x.", "x(x + 5)", "5(x + 1)", "x + 5", "x^2(5x)", "x(x + 5)", "Both terms share a common factor of x.", 3, topics),
            CreateQuestion("Algebra", "Solve 3(x + 2) = 21.", "5", "7", "9", "15", "5", "Divide by 3 to get x + 2 = 7, then subtract 2.", 3, topics),
            CreateQuestion("Geometry", "How many sides does a hexagon have?", "5", "6", "7", "8", "6", "A hexagon has six sides.", 1, topics),
            CreateQuestion("Geometry", "What shape has four equal sides and four right angles?", "Rectangle", "Rhombus", "Square", "Triangle", "Square", "A square has four equal sides and four right angles.", 1, topics),
            CreateQuestion("Geometry", "What is the area of a rectangle 8 cm long and 3 cm wide?", "11 cm^2", "16 cm^2", "22 cm^2", "24 cm^2", "24 cm^2", "Area of a rectangle is length times width.", 2, topics),
            CreateQuestion("Geometry", "What is the circumference of a circle with radius 7 cm, using pi = 22/7?", "14 cm", "22 cm", "44 cm", "49 cm", "44 cm", "Circumference is 2 pi r, so 2 x 22/7 x 7 = 44.", 2, topics),
            CreateQuestion("Geometry", "A rectangle has area 48 cm^2 and length 8 cm. What is its width?", "4 cm", "6 cm", "8 cm", "12 cm", "6 cm", "Width equals area divided by length, so 48 divided by 8 is 6.", 3, topics),
            CreateQuestion("Geometry", "A square has area 81 cm^2. What is the length of one side?", "8 cm", "9 cm", "18 cm", "27 cm", "9 cm", "The side length is the square root of 81.", 3, topics)
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
