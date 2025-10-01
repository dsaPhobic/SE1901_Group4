using WebAPI.Data;
using WebAPI.ExternalServices;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class WordRepository : IWordRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly DictionaryApiClient _apiClient;

        public WordRepository(ApplicationDbContext db, DictionaryApiClient apiClient)
        {
            _db = db;
            _apiClient = apiClient;
        }

        // CRUD
        public void Add(Word word) => _db.Word.Add(word);
        public void Delete(Word word) => _db.Word.Remove(word);
        public void Update(Word word) => _db.Word.Update(word);
        public void SaveChanges() => _db.SaveChanges();

        // Retrieval
        public Word? GetById(int id) => _db.Word.FirstOrDefault(w => w.WordId == id);
        public Word? GetByName(string term) =>
            _db.Word.FirstOrDefault(w => w.Term.ToLower() == term.ToLower());

        // Group-related operations
        public void AddWordToGroup(int groupId, int wordId)
        {
            var group = _db.VocabGroup.FirstOrDefault(g => g.GroupId == groupId);
            var word = _db.Word.FirstOrDefault(w => w.WordId == wordId);

            if (group != null && word != null)
            {
                group.Words.Add(word);
                SaveChanges();
            }
        }

        public void RemoveWordFromGroup(int groupId, int wordId)
        {
            var group = _db.VocabGroup.FirstOrDefault(g => g.GroupId == groupId);
            var word = _db.Word.FirstOrDefault(w => w.WordId == wordId);

            if (group != null && word != null)
            {
                group.Words.Remove(word);
                SaveChanges();
            }
        }

        public IEnumerable<Word> GetWordsByGroup(int groupId)
        {
            var group = _db.VocabGroup.FirstOrDefault(g => g.GroupId == groupId);
            return group?.Words ?? Enumerable.Empty<Word>();
        }

        public bool IsWordInGroup(int groupId, int wordId) =>
            _db.VocabGroup.Any(g => g.GroupId == groupId && g.Words.Any(w => w.WordId == wordId));

        // Fuzzy search
        public IEnumerable<Word> SearchWords(string keyword)
        {
            return _db.Word
                .Where(w =>
                    w.Term.ToLower().Contains(keyword.ToLower()) ||
                    (w.Meaning != null && w.Meaning.ToLower().Contains(keyword.ToLower())))
                .ToList();
        }

        // Lookup or fetch from API
        public Word? LookupOrFetch(string term)
        {
            var word = GetByName(term);
            if (word != null) return word;

            var fetchedWord = _apiClient.GetWord(term);
            if (fetchedWord != null)
            {
                _db.Word.Add(fetchedWord);
                SaveChanges();
            }
            return fetchedWord;
        }
    }
}
