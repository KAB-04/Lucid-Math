using System.ComponentModel.DataAnnotations;

namespace MathTutor.Application.DTOs.Topics;

public class UpdateTopicDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string DifficultyLevel { get; set; } = string.Empty;
}