namespace MathTutor.Domain.Entities;

public class Topic
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;


    public string DifficultyLevel { get; set; } = string.Empty;


    public ICollection<Question> Questions { get; set; }
        = new List<Question>();
}