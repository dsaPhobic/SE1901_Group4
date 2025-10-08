using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class ExamAttemptRepository : IExamAttemptRepository
    {
        private readonly ApplicationDbContext _db;

        public ExamAttemptRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public ExamAttempt? GetById(int id) =>
            _db.ExamAttempt.FirstOrDefault(r => r.AttemptId == id);

        public List<ExamAttempt> GetByExamId(int examId) =>
            _db.ExamAttempt.Where(r => r.ExamId == examId)
                       .ToList();

        public void Add(ExamAttempt ExamAttempt) => _db.ExamAttempt.Add(ExamAttempt);
        public void Update(ExamAttempt ExamAttempt) => _db.ExamAttempt.Update(ExamAttempt);
        public void Delete(ExamAttempt ExamAttempt) => _db.ExamAttempt.Remove(ExamAttempt);
        public void SaveChanges() => _db.SaveChanges();
    }
}
