using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IWordRepository
    {

        void Add(Word word);
        void Delete(Word word);
        void Update(Word word);
        void SaveChanges();
        Word GetById(int wordId);
        Word GetByName(string word);
        void AddWordToGroup(int groupId, int wordId);
        void RemoveWordFromGroup(int groupId, int wordId);
        IEnumerable<Word> GetWordsByGroup(int groupId);
        IEnumerable<Word> SearchWords(string keyword); 
        bool IsWordInGroup(int groupId, int wordId);
        public Word? LookupOrFetch(string term);
    }
}
