namespace MathTutor.Domain.Entities;

public class LearnerProfile
{
    public int Id { get; set; }


    public double OverallMastery { get; set; }


    public string Strengths { get; set; }
        = string.Empty;


    public string Weaknesses { get; set; }
        = string.Empty;


    public string LearningPreference { get; set; }
        = string.Empty;



    // Relationship

    public int StudentId { get; set; }

    public Student? Student { get; set; }
}