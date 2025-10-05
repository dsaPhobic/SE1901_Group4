using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class ExamRepository : IExamRepository
    {
        private readonly ApplicationDbContext _db;
        public ExamRepository(ApplicationDbContext db) => _db = db;

        // ===== Exam =====
        public Exam? GetById(int id) =>
            _db.Exam
               .Include(e => e.ExamAttempts)
               .Include(e => e.Listenings)
               .Include(e => e.Readings)
               .Include(e => e.Speakings)
               .Include(e => e.Writings)
               .FirstOrDefault(e => e.ExamId == id);

        public List<Exam> GetAll() =>
            _db.Exam.ToList();

        public void Add(Exam exam) => _db.Exam.Add(exam);
        public void Update(Exam exam) => _db.Exam.Update(exam);
        public void Delete(Exam exam) => _db.Exam.Remove(exam);

        // ===== Attempts =====
        public void AddAttempt(ExamAttempt attempt) => _db.ExamAttempt.Add(attempt);
        public void UpdateAttempt(ExamAttempt attempt) => _db.ExamAttempt.Update(attempt);

        public ExamAttempt? GetAttemptById(long attemptId) =>
            _db.ExamAttempt.Include(a => a.Exam)
                           .Include(a => a.User)
                           .FirstOrDefault(a => a.AttemptId == attemptId);

        public List<ExamAttemptSummaryDto> GetExamAttemptsByUser(int userId)
        {
            return _db.ExamAttempt
                .Where(a => a.UserId == userId)
                .Include(a => a.Exam)
                .Select(a => new ExamAttemptSummaryDto
                {
                    AttemptId = a.AttemptId,
                    StartedAt = a.StartedAt,
                    SubmittedAt = a.SubmittedAt,
                    ExamId = a.ExamId,
                    ExamName = a.Exam.ExamName,
                    ExamType = a.Exam.ExamType,
                    TotalScore = a.Score ?? 0
                })
                .ToList();
        }

        public ExamAttemptDto? GetExamAttemptDetail(long attemptId)
        {
            var a = _db.ExamAttempt
                .Include(a => a.Exam)
                .Include(a => a.User)
                .FirstOrDefault(a => a.AttemptId == attemptId);

            return a == null ? null : new ExamAttemptDto
            {
                AttemptId = a.AttemptId,
                StartedAt = a.StartedAt,
                SubmittedAt = a.SubmittedAt,
                ExamId = a.ExamId,
                ExamName = a.Exam.ExamName,
                ExamType = a.Exam.ExamType,
                TotalScore = a.Score ?? 0,
                AnswerText = a.AnswerText ?? string.Empty
            };
        }

        // ===== Common =====
        public void SaveChanges() => _db.SaveChanges();
    }
}
