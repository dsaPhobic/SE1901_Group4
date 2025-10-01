using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class VocabGroupRepository : IVocabGroupRepository
    {
        private readonly ApplicationDbContext _db;

        public VocabGroupRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public void Add(VocabGroup vocabGroup) => _db.VocabGroup.Add(vocabGroup);
        public void Update(VocabGroup vocabGroup) => _db.VocabGroup.Update(vocabGroup);
        public void Delete(VocabGroup vocabGroup) => _db.VocabGroup.Remove(vocabGroup);
        public void SaveChanges() => _db.SaveChanges();

        public VocabGroup? GetById(int groupId) =>
            _db.VocabGroup.Include(g => g.Words).FirstOrDefault(g => g.GroupId == groupId);

        public IEnumerable<VocabGroup> GetByUser(int userId) =>
            _db.VocabGroup.Include(g=>g.Words).Where(g => g.UserId == userId).ToList();

        public VocabGroup? GetByName(int userId, string groupName) =>
            _db.VocabGroup.Include(g=>g.Words).FirstOrDefault(g => g.UserId == userId && g.Groupname.ToLower() == groupName.ToLower());

        public bool ExistsForUser(int userId, string groupName) =>
            _db.VocabGroup.Any(g => g.UserId == userId && g.Groupname.ToLower() == groupName.ToLower());

        public int CountWords(int groupId)
        {
            var group = _db.VocabGroup.Include(g => g.Words).FirstOrDefault(g => g.GroupId == groupId);
            return group?.Words.Count ?? 0;
        }
    }
}
