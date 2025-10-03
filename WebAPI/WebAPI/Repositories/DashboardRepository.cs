using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;

namespace WebAPI.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ApplicationDbContext _db;

        public DashboardRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public List<ExamAttemptSummaryDTO> GetExamAttemptsByUser(int userId)
        {
            return _db.ExamAttempt
                .Where(a => a.UserId == userId)
                .Include(a => a.Exam)
                .Include(a => a.ExamAnswers)
                .Select(a => new ExamAttemptSummaryDTO
                {
                    AttemptId = a.AttemptId,
                    StartedAt = a.StartedAt,
                    SubmittedAt = a.SubmittedAt,
                    ExamId = a.ExamId,
                    ExamName = a.Exam.ExamName,
                    ExamType = a.Exam.ExamType,
                    TotalScore = a.ExamAnswers.Sum(ans => (decimal?)(ans.Score) ?? 0)
                })
                .ToList();
        }

        public ExamAttemptDetailDTO? GetExamAttemptDetail(long attemptId)
        {
            var attempt = _db.ExamAttempt
                .Where(a => a.AttemptId == attemptId)
                .Include(a => a.Exam)
                .Include(a => a.ExamAnswers)
                .FirstOrDefault();

            if (attempt == null) return null;

            return new ExamAttemptDetailDTO
            {
                AttemptId = attempt.AttemptId,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                ExamId = attempt.ExamId,
                ExamName = attempt.Exam.ExamName,
                ExamType = attempt.Exam.ExamType,
                TotalScore = attempt.ExamAnswers.Sum(ans => (decimal?)(ans.Score) ?? 0),
                Answers = attempt.ExamAnswers.Select(ans => new ExamAnswerDTO
                {
                    AnswerId = ans.AnswerId,
                    ItemId = ans.ItemId,
                    AnswerText = ans.AnswerText,
                    Score = ans.Score,
                    IsCorrect = ans.IsCorrect
                }).ToList()
            };
        }
    }
}
