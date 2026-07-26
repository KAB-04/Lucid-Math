namespace MathTutor.Domain.Entities;

public class LearningHistory
{
    public int Id { get; set; }


    public string Activity { get; set; }
        = string.Empty;

    public string EventType { get; set; }
        = string.Empty;


    public double Performance { get; set; }

    public int? TopicId { get; set; }

    public Topic? Topic { get; set; }

    public int? AssessmentId { get; set; }

    public Assessment? Assessment { get; set; }


    public DateTime DateCompleted { get; set; }
        = DateTime.UtcNow;



    // Relationship

    public int StudentId { get; set; }

    public Student? Student { get; set; }
}
