using WebAPI.Data;
using WebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace WebAPI.Repositories
{
    public class WritingRepository : IWritingRepository
    {
        private readonly ApplicationDbContext _db;
        public WritingRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public Writing? GetById(int id) =>
            _db.Writing.FirstOrDefault(w => w.WritingId == id);

        public List<Writing> GetByExamId(int examId) =>
            _db.Writing.Where(w => w.ExamId == examId)
                       .OrderBy(w => w.DisplayOrder)
                       .ToList();

        public void Add(Writing writing) => _db.Writing.Add(writing);
        public void Update(Writing writing) => _db.Writing.Update(writing);
        public void Delete(Writing writing) => _db.Writing.Remove(writing);
        public void SaveChanges() => _db.SaveChanges();

        public ExamAttempt AddExamAttempt(int examId, int userId, string answer, decimal? score = null)
        {
            var attempt = new ExamAttempt
            {
                ExamId = examId,
                UserId = userId,
                AnswerText = answer,
                Score = score,
                StartedAt = DateTime.Now,
                SubmittedAt = DateTime.Now
            };
            _db.ExamAttempt.Add(attempt);
            _db.SaveChanges();
            return attempt;
        }

        public void SaveFeedback(long attemptId, JsonDocument feedbackJson)
        {
           
            var attempt = _db.ExamAttempt.FirstOrDefault(a => a.AttemptId == attemptId);
            if (attempt != null)
            {
                attempt.AnswerText += "\n\n---\n[AI Feedback JSON]\n" + feedbackJson.RootElement.ToString();
                _db.SaveChanges();
            }
        }
    }
}
