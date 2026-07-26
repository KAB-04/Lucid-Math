namespace MathTutor.Domain.Entities;

public class AssessmentQuestion
{
    public int Id { get; set; }

    public int AssessmentId { get; set; }

    public Assessment? Assessment { get; set; }

    public int QuestionId { get; set; }

    public Question? Question { get; set; }

    public int Order { get; set; }
}
