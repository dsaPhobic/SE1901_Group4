using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class ReadingService : IReadingService
    {
        private readonly IReadingRepository _repo;

        public ReadingService(IReadingRepository repo)
        {
            _repo = repo;
        }

        public ReadingDto? GetById(int id)
        {
            var r = _repo.GetById(id);
            return r == null ? null : MapToDto(r);
        }

        public List<ReadingDto> GetByExam(int examId)
        {
            return _repo.GetByExamId(examId).Select(MapToDto).ToList();
        }

        public ReadingDto Create(CreateReadingDto dto)
        {
            var entity = new Reading
            {
                ExamId = dto.ExamId,
                ReadingContent = dto.ReadingContent,
                ReadingQuestion = dto.ReadingQuestion,
                ReadingType = dto.ReadingType,
                DisplayOrder = dto.DisplayOrder,
                CorrectAnswer = dto.CorrectAnswer,
                QuestionHtml = dto.QuestionHtml,
                CreatedAt = DateTime.UtcNow
            };

            _repo.Add(entity);
            _repo.SaveChanges();
            return MapToDto(entity);
        }

        public ReadingDto? Update(int id, UpdateReadingDto dto)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return null;

            if (dto.ReadingContent != null) existing.ReadingContent = dto.ReadingContent;
            if (dto.ReadingQuestion != null) existing.ReadingQuestion = dto.ReadingQuestion;
            if (dto.ReadingType != null) existing.ReadingType = dto.ReadingType;
            if (dto.DisplayOrder.HasValue) existing.DisplayOrder = dto.DisplayOrder.Value;
            if (dto.CorrectAnswer != null) existing.CorrectAnswer = dto.CorrectAnswer;
            if (dto.QuestionHtml != null) existing.QuestionHtml = dto.QuestionHtml;

            _repo.Update(existing);
            _repo.SaveChanges();

            return MapToDto(existing);
        }

        public bool Delete(int id)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return false;

            _repo.Delete(existing);
            _repo.SaveChanges();
            return true;
        }

        private static ReadingDto MapToDto(Reading r) =>
            new ReadingDto
            {
                ReadingId = r.ReadingId,
                ExamId = r.ExamId,
                ReadingContent = r.ReadingContent,
                ReadingQuestion = r.ReadingQuestion,
                ReadingType = r.ReadingType,
                DisplayOrder = r.DisplayOrder,
                CreatedAt = r.CreatedAt,
                CorrectAnswer = r.CorrectAnswer,
                QuestionHtml = r.QuestionHtml
            };
    }
}
