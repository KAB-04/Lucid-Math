namespace MathTutor.Application.DTOs.Topics;

public class TopicDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string DifficultyLevel { get; set; } = string.Empty;
}