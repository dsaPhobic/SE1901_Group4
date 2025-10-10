using WebAPI.Data;
using WebAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace WebAPI.Repositories
{
    public class WritingFeedbackRepository : IWritingFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public WritingFeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Add(WritingFeedback feedback)
        {
            _context.WritingFeedback.Add(feedback);
        }

        public void AddRange(IEnumerable<WritingFeedback> feedbacks)
        {
            _context.WritingFeedback.AddRange(feedbacks);
        }

        public WritingFeedback? GetById(int id)
        {
            return _context.WritingFeedback.FirstOrDefault(f => f.FeedbackId == id);
        }

        public List<WritingFeedback> GetByWritingId(int writingId)
        {
            return _context.WritingFeedback
                .Where(f => f.WritingId == writingId)
                .OrderByDescending(f => f.CreatedAt)
                .ToList();
        }

        public List<WritingFeedback> GetByAttemptId(long attemptId)
        {
            return _context.WritingFeedback
                .Where(f => f.AttemptId == attemptId)
                .OrderByDescending(f => f.CreatedAt)
                .ToList();
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
