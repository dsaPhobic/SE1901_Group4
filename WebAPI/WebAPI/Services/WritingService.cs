using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using WebAPI.DTOs;
using WebAPI.ExternalServices;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class WritingService : IWritingService
    {
        private readonly IWritingRepository _writingRepo;
        private readonly IWritingFeedbackRepository _feedbackRepo;
        private readonly OpenAIService _openAI;

        public WritingService(
            IWritingRepository writingRepo,
            IWritingFeedbackRepository feedbackRepo,
            OpenAIService openAI)
        {
            _writingRepo = writingRepo;
            _feedbackRepo = feedbackRepo;
            _openAI = openAI;
        }

        // =====================
        // == CRUD METHODS ==
        // =====================
        public WritingDTO? GetById(int id)
        {
            var w = _writingRepo.GetById(id);
            return w == null ? null : MapToDto(w);
        }

        public List<WritingDTO> GetByExam(int examId)
        {
            return _writingRepo.GetByExamId(examId).Select(MapToDto).ToList();
        }

        public WritingDTO Create(WritingDTO dto)
        {
            var entity = new Writing
            {
                ExamId = dto.ExamId,
                WritingQuestion = dto.WritingQuestion,
                DisplayOrder = dto.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                ImageUrl = dto.ImageUrl
            };

            _writingRepo.Add(entity);
            _writingRepo.SaveChanges();
            return MapToDto(entity);
        }

        public WritingDTO? Update(int id, WritingDTO dto)
        {
            var existing = _writingRepo.GetById(id);
            if (existing == null) return null;

            existing.WritingQuestion = dto.WritingQuestion ?? existing.WritingQuestion;
            existing.DisplayOrder = dto.DisplayOrder > 0 ? dto.DisplayOrder : existing.DisplayOrder;
            existing.ImageUrl = dto.ImageUrl ?? existing.ImageUrl;

            _writingRepo.Update(existing);
            _writingRepo.SaveChanges();
            return MapToDto(existing);
        }

        public bool Delete(int id)
        {
            var existing = _writingRepo.GetById(id);
            if (existing == null) return false;
            _writingRepo.Delete(existing);
            _writingRepo.SaveChanges();
            return true;
        }

        // ======================
        // == GRADING LOGIC ==
        // ======================
        public JsonDocument GradeWriting(WritingGradeRequestDTO dto, int userId)
        {
            if (dto.Mode == "single")
            {
                var ans = dto.Answers.First();
                return GradeSingle(dto.ExamId, userId, ans);
            }
            else
            {
                return GradeFull(dto.ExamId, userId, dto.Answers);
            }
        }

        private JsonDocument GradeSingle(int examId, int userId, WritingAnswerDTO ans)
        {
            var question = _writingRepo.GetById(ans.WritingId)?.WritingQuestion ?? "Unknown question";
            var result = _openAI.GradeWriting(question, ans.AnswerText, ans.ImageUrl);

            SaveFeedback(examId, ans.WritingId, result, userId);
            return result;
        }

        private JsonDocument GradeFull(int examId, int userId, List<WritingAnswerDTO> answers)
        {
            var feedbacks = new List<object>();

            foreach (var ans in answers)
            {
                var question = _writingRepo.GetById(ans.WritingId)?.WritingQuestion ?? "Unknown question";
                var result = _openAI.GradeWriting(question, ans.AnswerText, ans.ImageUrl);

                SaveFeedback(examId, ans.WritingId, result, userId);

                feedbacks.Add(new
                {
                    writingId = ans.WritingId,
                    displayOrder = ans.DisplayOrder,
                    feedback = JsonSerializer.Deserialize<object>(result.RootElement.GetRawText())
                });
            }

            var response = new
            {
                message = "Full writing test graded successfully.",
                examId,
                totalAnswers = answers.Count,
                feedbacks
            };

            return JsonDocument.Parse(JsonSerializer.Serialize(response));
        }

        private void SaveFeedback(int examId, int writingId, JsonDocument feedback, int userId)
        {
            try
            {
                var band = feedback.RootElement.GetProperty("band_estimate");

                var entity = new WritingFeedback
                {
                    AttemptId = 0,
                    WritingId = writingId,
                    TaskAchievement = band.GetProperty("task_achievement").GetDecimal(),
                    CoherenceCohesion = band.GetProperty("coherence_cohesion").GetDecimal(),
                    LexicalResource = band.GetProperty("lexical_resource").GetDecimal(),
                    GrammarAccuracy = band.GetProperty("grammar_accuracy").GetDecimal(),
                    Overall = band.GetProperty("overall").GetDecimal(),
                    GrammarVocabJson = feedback.RootElement.GetProperty("grammar_vocab").GetRawText(),
                    FeedbackSections = feedback.RootElement.GetProperty("coherence_logic").GetRawText(),
                    CreatedAt = DateTime.UtcNow
                };

                _feedbackRepo.Add(entity);
                _feedbackRepo.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SaveFeedback] Failed: {ex.Message}");
            }
        }

        private static WritingDTO MapToDto(Writing w) =>
            new WritingDTO
            {
                WritingId = w.WritingId,
                ExamId = w.ExamId,
                WritingQuestion = w.WritingQuestion,
                DisplayOrder = w.DisplayOrder,
                CreatedAt = w.CreatedAt,
                ImageUrl = w.ImageUrl
            };
    }
}
