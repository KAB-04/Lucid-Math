namespace MathTutor.Application.DTOs.Questions;

public class QuestionDto
{
    public int Id { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public string OptionA { get; set; } = string.Empty;

    public string OptionB { get; set; } = string.Empty;

    public string OptionC { get; set; } = string.Empty;

    public string OptionD { get; set; } = string.Empty;

    public string CorrectAnswer { get; set; } = string.Empty;

    public string Explanation { get; set; } = string.Empty;

    public int DifficultyLevel { get; set; }

    public int TopicId { get; set; }

    public string TopicName { get; set; } = string.Empty;
}
