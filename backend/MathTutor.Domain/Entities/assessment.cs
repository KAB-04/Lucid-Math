namespace MathTutor.Domain.Entities;

public class Assessment
{
    public int Id { get; set; }


    public DateTime DateTaken { get; set; }
        = DateTime.UtcNow;


    public double Score { get; set; }


    // Relationship

    public int StudentId { get; set; }

    public Student? Student { get; set; }
}