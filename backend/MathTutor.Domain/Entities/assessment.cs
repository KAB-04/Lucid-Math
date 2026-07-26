namespace MathTutor.Domain.Entities;

public class Assessment
{
    public int Id { get; set; }

    public DateTime StartedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime DateTaken { get; set; }
        = DateTime.UtcNow;

    public bool IsCompleted { get; set; }

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public int IncorrectAnswers { get; set; }

    public double Score { get; set; }

    public int? TopicId { get; set; }

    public Topic? Topic { get; set; }

    public int? DifficultyLevel { get; set; }


    // Relationship

    public int StudentId { get; set; }

    public Student? Student { get; set; }

    public ICollection<AssessmentQuestion> AssessmentQuestions { get; set; }
        = new List<AssessmentQuestion>();

    public ICollection<StudentAnswer> StudentAnswers { get; set; }
        = new List<StudentAnswer>();
}
