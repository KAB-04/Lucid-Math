using MathTutor.Application.DTOs.Questions;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Domain.Entities;

namespace MathTutor.Application.Services;

public class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ITopicRepository _topicRepository;

    public QuestionService(
        IQuestionRepository questionRepository,
        ITopicRepository topicRepository)
    {
        _questionRepository = questionRepository;
        _topicRepository = topicRepository;
    }

    public async Task<IEnumerable<QuestionDto>> GetAllAsync()
    {
        var questions = await _questionRepository.GetAllAsync();

        return questions.Select(MapToDto);
    }

    public async Task<QuestionDto?> GetByIdAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);

        return question == null ? null : MapToDto(question);
    }

    public async Task<IEnumerable<QuestionDto>> GetByTopicIdAsync(int topicId)
    {
        var questions = await _questionRepository.GetByTopicIdAsync(topicId);

        return questions.Select(MapToDto);
    }

    public async Task<(bool Success, string Message, QuestionDto? Data)>
        CreateAsync(CreateQuestionDto dto)
    {
        var validationMessage = ValidateQuestion(dto);

        if (validationMessage != null)
        {
            return (false, validationMessage, null);
        }

        var topic = await _topicRepository.GetByIdAsync(dto.TopicId);

        if (topic == null)
        {
            return (false, "Topic was not found.", null);
        }

        var question = new Question
        {
            QuestionText = dto.QuestionText.Trim(),
            OptionA = dto.OptionA.Trim(),
            OptionB = dto.OptionB.Trim(),
            OptionC = dto.OptionC.Trim(),
            OptionD = dto.OptionD.Trim(),
            CorrectAnswer = dto.CorrectAnswer.Trim(),
            Explanation = dto.Explanation.Trim(),
            DifficultyLevel = dto.DifficultyLevel,
            TopicId = dto.TopicId
        };

        var createdQuestion = await _questionRepository.CreateAsync(question);
        createdQuestion.Topic = topic;

        return (
            true,
            "Question created successfully.",
            MapToDto(createdQuestion)
        );
    }

    public async Task<(bool Success, string Message, QuestionDto? Data)>
        UpdateAsync(int id, UpdateQuestionDto dto)
    {
        var question = await _questionRepository.GetByIdAsync(id);

        if (question == null)
        {
            return (false, "Question was not found.", null);
        }

        var validationMessage = ValidateQuestion(dto);

        if (validationMessage != null)
        {
            return (false, validationMessage, null);
        }

        var topic = await _topicRepository.GetByIdAsync(dto.TopicId);

        if (topic == null)
        {
            return (false, "Topic was not found.", null);
        }

        question.QuestionText = dto.QuestionText.Trim();
        question.OptionA = dto.OptionA.Trim();
        question.OptionB = dto.OptionB.Trim();
        question.OptionC = dto.OptionC.Trim();
        question.OptionD = dto.OptionD.Trim();
        question.CorrectAnswer = dto.CorrectAnswer.Trim();
        question.Explanation = dto.Explanation.Trim();
        question.DifficultyLevel = dto.DifficultyLevel;
        question.TopicId = dto.TopicId;
        question.Topic = topic;

        await _questionRepository.UpdateAsync(question);

        return (
            true,
            "Question updated successfully.",
            MapToDto(question)
        );
    }

    public async Task<(bool Success, string Message)> DeleteAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);

        if (question == null)
        {
            return (false, "Question was not found.");
        }

        await _questionRepository.DeleteAsync(question);

        return (true, "Question deleted successfully.");
    }

    private static string? ValidateQuestion(CreateQuestionDto dto)
    {
        return ValidateQuestionValues(
            dto.QuestionText,
            dto.OptionA,
            dto.OptionB,
            dto.OptionC,
            dto.OptionD,
            dto.CorrectAnswer,
            dto.DifficultyLevel);
    }

    private static string? ValidateQuestion(UpdateQuestionDto dto)
    {
        return ValidateQuestionValues(
            dto.QuestionText,
            dto.OptionA,
            dto.OptionB,
            dto.OptionC,
            dto.OptionD,
            dto.CorrectAnswer,
            dto.DifficultyLevel);
    }

    private static string? ValidateQuestionValues(
        string questionText,
        string optionA,
        string optionB,
        string optionC,
        string optionD,
        string correctAnswer,
        int difficultyLevel)
    {
        if (string.IsNullOrWhiteSpace(questionText) ||
            string.IsNullOrWhiteSpace(optionA) ||
            string.IsNullOrWhiteSpace(optionB) ||
            string.IsNullOrWhiteSpace(optionC) ||
            string.IsNullOrWhiteSpace(optionD) ||
            string.IsNullOrWhiteSpace(correctAnswer))
        {
            return "Question text, four options and correct answer are required.";
        }

        if (difficultyLevel < 1 || difficultyLevel > 3)
        {
            return "Difficulty level must be 1, 2 or 3.";
        }

        var options = new[]
        {
            optionA.Trim(),
            optionB.Trim(),
            optionC.Trim(),
            optionD.Trim()
        };

        if (!options.Contains(
            correctAnswer.Trim(),
            StringComparer.OrdinalIgnoreCase))
        {
            return "Correct answer must match one of the four options.";
        }

        return null;
    }

    private static QuestionDto MapToDto(Question question)
    {
        return new QuestionDto
        {
            Id = question.Id,
            QuestionText = question.QuestionText,
            OptionA = question.OptionA,
            OptionB = question.OptionB,
            OptionC = question.OptionC,
            OptionD = question.OptionD,
            CorrectAnswer = question.CorrectAnswer,
            Explanation = question.Explanation,
            DifficultyLevel = question.DifficultyLevel,
            TopicId = question.TopicId,
            TopicName = question.Topic?.Name ?? string.Empty
        };
    }
}
