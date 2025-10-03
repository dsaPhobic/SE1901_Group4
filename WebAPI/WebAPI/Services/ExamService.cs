using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _repo;
        private readonly ApplicationDbContext _db;

        public ExamService(IExamRepository repo, ApplicationDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        public Exam? GetById(int id) => _repo.GetById(id);

        public List<Exam> GetAll() => _repo.GetAll();

        public List<Exam> GetByUser(int userId) =>
            _db.Exam.Where(e => _db.ExamAttempt.Any(a => a.UserId == userId && a.ExamId == e.ExamId))
                    .ToList();

        public Exam Create(CreateExamDTO exam)
        {
            Exam newExam = new Exam()
            {
                ExamName=exam.ExamName,
                ExamType=exam.ExamType,
            };
            _repo.Add(newExam);
            _repo.SaveChanges();
            return newExam;
        }

        public Exam? Update(int id, UpdateExamDTO exam)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return null;

            if (!string.IsNullOrWhiteSpace(exam.ExamName)) existing.ExamName = exam.ExamName;
            if (!string.IsNullOrWhiteSpace(exam.ExamType)) existing.ExamType = exam.ExamType;

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

        public ExamAttempt StartAttempt(int examId, int userId)
        {
            var exam = _repo.GetById(examId) ?? throw new KeyNotFoundException("Exam not found");

            var attempt = new ExamAttempt
            {
                ExamId = examId,
                UserId = userId,
                StartedAt = DateTime.UtcNow
            };

            _repo.AddAttempt(attempt);
            _repo.SaveChanges();
            return attempt;
        }

        public void SubmitAttempt(int attemptId)
        {
            var attempt = _db.ExamAttempt.FirstOrDefault(a => a.AttemptId == attemptId)
                ?? throw new KeyNotFoundException("Attempt not found");

            attempt.SubmittedAt = DateTime.UtcNow;
            _db.ExamAttempt.Update(attempt);
            _repo.SaveChanges();
        }
    }
}
