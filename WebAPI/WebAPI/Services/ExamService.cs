using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _repo;
        private readonly IReadingService _reading;

        public ExamService(IExamRepository repo)
        {
            _repo = repo;
        }

        // ===== Exams =====
        public Exam? GetById(int id) => _repo.GetById(id);
        public List<Exam> GetAll() => _repo.GetAll();

        public Exam Create(CreateExamDto dto)
        {
            var exam = new Exam
            {
                ExamName = dto.ExamName,
                ExamType = dto.ExamType
            };

            _repo.Add(exam);
            _repo.SaveChanges();
            return exam;
        }

        public Exam? Update(int id, UpdateExamDto dto)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.ExamName))
                existing.ExamName = dto.ExamName;
            if (!string.IsNullOrWhiteSpace(dto.ExamType))
                existing.ExamType = dto.ExamType;

            _repo.Update(existing);
            _repo.SaveChanges();
            return existing;
        }

        public bool Delete(int id)
        {
            var exam = _repo.GetById(id);
            if (exam == null) return false;

            _repo.Delete(exam);
            _repo.SaveChanges();
            return true;
        }

        // ===== Attempts =====

        public ExamAttempt SubmitAttempt(int examId, int userId, string answerText, DateTime startedAt)
        {
            var exam = _repo.GetById(examId);
            if (exam == null)
                throw new KeyNotFoundException("Exam not found");

            var attempt = new ExamAttempt
            {
                ExamId = examId,
                UserId = userId,
                StartedAt = startedAt,
                SubmittedAt = DateTime.UtcNow,
                AnswerText = answerText
            };

            switch (exam.ExamType.ToLower())
            {
                case "reading":
                    attempt.Score = _reading.Evaluate(examId, answerText);
                    break;

                //case "listening":
                //    attempt.Score = _listeningEvaluator.Evaluate(examId, answerText);
                //    break;

                //case "writing":
                //    attempt.Score = _writingEvaluator.Evaluate(examId, answerText, userId);
                //    break;

                //case "speaking":
                //    attempt.Score = _speakingEvaluator.Evaluate(examId, answerText, userId);
                //    break;

                default:
                    attempt.Score = 0;
                    break;
            }

            _repo.AddAttempt(attempt);
            _repo.SaveChanges();

            return attempt;
        }


        public ExamAttempt? GetAttemptById(long attemptId) => _repo.GetAttemptById(attemptId);

        public List<ExamAttemptSummaryDto> GetExamAttemptsByUser(int userId) =>
            _repo.GetExamAttemptsByUser(userId);

        public ExamAttemptDto? GetExamAttemptDetail(long attemptId) =>
            _repo.GetExamAttemptDetail(attemptId);

        public void Save() => _repo.SaveChanges();
    }
}
