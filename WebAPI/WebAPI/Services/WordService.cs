using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class WordService : IWordService
    {
        private readonly IWordRepository _repo;
        private readonly ApplicationDbContext _db;
        public WordService(IWordRepository repo, ApplicationDbContext _db)
        {
            _repo = repo;
            this._db = _db;
        }
        public List<Word> GetByIds(List<int> ids)
        {
            return _db.Word
                      .Where(w => ids.Contains(w.WordId))
                      .ToList();
        }
        // CRUD
        public Word? GetById(int id) => _repo.GetById(id);
        public Word? GetByName(string term) => _repo.GetByName(term);
        public void Add(Word word)
        {
            _repo.Add(word);
            _repo.SaveChanges();
        }

        public void Update(Word word)
        {
            _repo.Update(word);
            _repo.SaveChanges();
        }

        public void Delete(int id)
        {
            var word = _repo.GetById(id);
            if (word != null)
            {
                _repo.Delete(word);
                _repo.SaveChanges();
            }
        }

        public void Save() => _repo.SaveChanges();

        // Search
        public IEnumerable<Word> Search(string keyword) => _repo.SearchWords(keyword);

        // Group-related
        public void AddWordToGroup(int groupId, int wordId)
        {
            _repo.AddWordToGroup(groupId, wordId);
            _repo.SaveChanges();
        }

        public void RemoveWordFromGroup(int groupId, int wordId)
        {
            _repo.RemoveWordFromGroup(groupId, wordId);
            _repo.SaveChanges();
        }

        public IEnumerable<Word> GetWordsByGroup(int groupId) => _repo.GetWordsByGroup(groupId);

        public bool IsWordInGroup(int groupId, int wordId) => _repo.IsWordInGroup(groupId, wordId);

        public Word LookupOrFetch(string term) => _repo.LookupOrFetch(term);

        
    }
}
