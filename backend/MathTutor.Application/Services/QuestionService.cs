using MathTutor.Application.DTOs.Questions;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Domain.Entities;

namespace MathTutor.Application.Services;

public class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ITopicRepository _topicRepository;

    public QuestionService(IQuestionRepository questionRepository, ITopicRepository topicRepository)
    {
        _questionRepository = questionRepository;
        _topicRepository = topicRepository;
    }

    public async Task<IEnumerable<QuestionDto>> GetAllAsync() =>
        (await _questionRepository.GetAllAsync()).Select(MapToDto);

    public async Task<QuestionDto?> GetByIdAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        return question is null ? null : MapToDto(question);
    }

    public async Task<IEnumerable<QuestionDto>> GetByTopicIdAsync(int topicId) =>
        (await _questionRepository.GetByTopicIdAsync(topicId)).Select(MapToDto);

    public async Task<(bool Success, string Message, QuestionDto? Data)> CreateAsync(CreateQuestionDto dto)
    {
        var topic = await _topicRepository.GetByIdAsync(dto.TopicId);
        if (topic is null) return (false, "The selected topic was not found.", null);
        if (!IsValidCorrectAnswer(dto.CorrectAnswer, dto.OptionA, dto.OptionB, dto.OptionC, dto.OptionD))
            return (false, "Correct answer must match one of the supplied options.", null);

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
            TopicId = dto.TopicId,
            Topic = topic
        };

        return (true, "Question created successfully.", MapToDto(await _questionRepository.CreateAsync(question)));
    }

    public async Task<(bool Success, string Message, QuestionDto? Data)> UpdateAsync(int id, UpdateQuestionDto dto)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        if (question is null) return (false, "Question was not found.", null);

        var topic = await _topicRepository.GetByIdAsync(dto.TopicId);
        if (topic is null) return (false, "The selected topic was not found.", null);
        if (!IsValidCorrectAnswer(dto.CorrectAnswer, dto.OptionA, dto.OptionB, dto.OptionC, dto.OptionD))
            return (false, "Correct answer must match one of the supplied options.", null);

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
        return (true, "Question updated successfully.", MapToDto(question));
    }

    public async Task<(bool Success, string Message)> DeleteAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        if (question is null) return (false, "Question was not found.");
        await _questionRepository.DeleteAsync(question);
        return (true, "Question deleted successfully.");
    }

    private static bool IsValidCorrectAnswer(string correct, params string[] options) =>
        options.Any(option => correct.Trim().Equals(option.Trim(), StringComparison.OrdinalIgnoreCase));

    private static QuestionDto MapToDto(Question question) => new()
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
