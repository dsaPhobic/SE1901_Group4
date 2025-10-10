using WebAPI.Models;
using System.Collections.Generic;
using System.Text.Json;

namespace WebAPI.Repositories
{
    public interface IWritingRepository
    {
        Writing? GetById(int id);
        List<Writing> GetByExamId(int examId);
        void Add(Writing writing);
        void Update(Writing writing);
        void Delete(Writing writing);
        void SaveChanges();

        ExamAttempt AddExamAttempt(int examId, int userId, string answer, decimal? score = null);
        void SaveFeedback(long attemptId, JsonDocument feedbackJson);
    }
}
