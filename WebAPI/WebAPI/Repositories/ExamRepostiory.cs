using WebAPI.Data;
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
    }
}
