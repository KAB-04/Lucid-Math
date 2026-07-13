namespace MathTutor.Domain.Entities;

public class Question
{
    public int Id { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public string CorrectAnswer { get; set; } = string.Empty;


    public int DifficultyLevel { get; set; }


    // Relationship

    public int TopicId { get; set; }

    public Topic? Topic { get; set; }
}