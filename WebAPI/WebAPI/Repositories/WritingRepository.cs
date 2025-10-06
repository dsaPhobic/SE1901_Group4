using WebAPI.Data;
using WebAPI.Models;
using System.Collections.Generic;
using System.Linq;

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
    }
}
