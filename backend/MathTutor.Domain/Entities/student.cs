using MathTutor.Domain.Identity;
namespace MathTutor.Domain.Entities;

public class Student
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public string EducationLevel { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public LearnerProfile? LearnerProfile { get; set; }

    public ICollection<Assessment> Assessments { get; set; }
        = new List<Assessment>();

    public ICollection<LearningHistory> LearningHistory { get; set; }
        = new List<LearningHistory>();
}