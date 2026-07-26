namespace MathTutor.Domain.Entities;

public class LearnerProfile
{
    public int Id { get; set; }


    public double OverallMastery { get; set; }

    public string StrongestTopic { get; set; }
        = string.Empty;

    public string WeakestTopic { get; set; }
        = string.Empty;

    public int RecommendedDifficultyLevel { get; set; } = 1;

    public string RecommendedNextTopic { get; set; }
        = string.Empty;

    public string TeachingApproach { get; set; }
        = string.Empty;

    public DateTime LastUpdated { get; set; }
        = DateTime.UtcNow;


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
