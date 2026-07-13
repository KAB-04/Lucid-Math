namespace MathTutor.Domain.Entities;

public class Student
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string EducationLevel { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    // Relationships

    public LearnerProfile? LearnerProfile { get; set; }

    public ICollection<Assessment> Assessments { get; set; }
        = new List<Assessment>();

    public ICollection<LearningHistory> LearningHistory { get; set; }
        = new List<LearningHistory>();
}