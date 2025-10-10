using WebAPI.Models;
using System.Collections.Generic;

namespace WebAPI.Repositories
{
    public interface IWritingFeedbackRepository
    {
        void Add(WritingFeedback feedback);
        void AddRange(IEnumerable<WritingFeedback> feedbacks);
        WritingFeedback? GetById(int id);
        List<WritingFeedback> GetByWritingId(int writingId);
        List<WritingFeedback> GetByAttemptId(long attemptId);
        void SaveChanges();
    }
}
