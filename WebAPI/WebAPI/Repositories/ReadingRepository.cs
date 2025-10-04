using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class ReadingRepository : IReadingRepository
    {
        private readonly ApplicationDbContext _db;

        public ReadingRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public Reading? GetById(int id) =>
            _db.Reading.FirstOrDefault(r => r.ReadingId == id);

        public List<Reading> GetByExamId(int examId) =>
            _db.Reading.Where(r => r.ExamId == examId)
                       .OrderBy(r => r.DisplayOrder)
                       .ToList();

        public void Add(Reading reading) => _db.Reading.Add(reading);
        public void Update(Reading reading) => _db.Reading.Update(reading);
        public void Delete(Reading reading) => _db.Reading.Remove(reading);
        public void SaveChanges() => _db.SaveChanges();
    }
}
