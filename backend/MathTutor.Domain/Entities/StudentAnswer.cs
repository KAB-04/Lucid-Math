namespace MathTutor.Domain.Entities;

public class StudentAnswer
{
    public int Id { get; set; }

    public int AssessmentId { get; set; }

    public Assessment? Assessment { get; set; }

    public int QuestionId { get; set; }

    public Question? Question { get; set; }

    public string SelectedAnswer { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}
