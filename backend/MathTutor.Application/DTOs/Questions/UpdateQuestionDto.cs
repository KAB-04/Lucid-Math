using System.ComponentModel.DataAnnotations;

namespace MathTutor.Application.DTOs.Questions;

public class UpdateQuestionDto
{
    [Required]
    public string QuestionText { get; set; } = string.Empty;

    [Required]
    public string OptionA { get; set; } = string.Empty;

    [Required]
    public string OptionB { get; set; } = string.Empty;

    [Required]
    public string OptionC { get; set; } = string.Empty;

    [Required]
    public string OptionD { get; set; } = string.Empty;

    [Required]
    public string CorrectAnswer { get; set; } = string.Empty;

    public string Explanation { get; set; } = string.Empty;

    [Range(1, 3)]
    public int DifficultyLevel { get; set; }

    [Range(1, int.MaxValue)]
    public int TopicId { get; set; }
}
