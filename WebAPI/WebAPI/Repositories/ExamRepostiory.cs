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
            _db.Exam.FirstOrDefault(e => e.ExamId == id);

        public List<Exam> GetAll() =>
            _db.Exam.ToList();

        public void Add(Exam exam) => _db.Exam.Add(exam);
        public void Update(Exam exam) => _db.Exam.Update(exam);
        public void Delete(Exam exam) => _db.Exam.Remove(exam);


        // ===== Attempt & Answer =====
        public void AddAttempt(ExamAttempt attempt) => _db.ExamAttempt.Add(attempt);

        // ===== Common =====
        public void SaveChanges() => _db.SaveChanges();

        public List<ExamAttemptDTO> GetExamAttemptsByUser(int userId)
        {
            return _db.ExamAttempt
                .Where(a => a.UserId == userId)
                .Include(a => a.Exam)
                .Select(a => new ExamAttemptDTO
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

        public ExamAttemptDTO? GetExamAttemptDetail(long attemptId)
        {
            var attempt = _db.ExamAttempt
                .Where(a => a.AttemptId == attemptId)
                .Include(a => a.Exam)
                .FirstOrDefault();

            if (attempt == null) return null;

            return new ExamAttemptDTO
            {
                AttemptId = attempt.AttemptId,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                ExamId = attempt.ExamId,
                ExamName = attempt.Exam.ExamName,
                ExamType = attempt.Exam.ExamType,
                TotalScore = attempt.Score ?? 0
            };
        }
    }
}
