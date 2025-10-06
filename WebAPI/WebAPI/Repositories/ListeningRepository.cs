using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class ListeningRepository : IListeningRepository
    {
        private readonly ApplicationDbContext _db;

        public ListeningRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public Listening? GetById(int id) =>
            _db.Listening.FirstOrDefault(r => r.ListeningId == id);

        public List<Listening> GetByExamId(int examId) =>
            _db.Listening.Where(r => r.ExamId == examId)
                       .OrderBy(r => r.DisplayOrder)
                       .ToList();

        public void Add(Listening Listening) => _db.Listening.Add(Listening);
        public void Update(Listening Listening) => _db.Listening.Update(Listening);
        public void Delete(Listening Listening) => _db.Listening.Remove(Listening);
        public void SaveChanges() => _db.SaveChanges();
    }
}
