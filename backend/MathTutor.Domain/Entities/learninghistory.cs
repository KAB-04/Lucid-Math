namespace MathTutor.Domain.Entities;

public class LearningHistory
{
    public int Id { get; set; }


    public string Activity { get; set; }
        = string.Empty;


    public double Performance { get; set; }


    public DateTime DateCompleted { get; set; }
        = DateTime.UtcNow;



    // Relationship

    public int StudentId { get; set; }

    public Student? Student { get; set; }
}