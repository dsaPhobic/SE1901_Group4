using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IWordService
    {
        Word? GetById(int id);
        Word? GetByName(string term);
        IEnumerable<Word> Search(string keyword);
        Word LookupOrFetch(string term);

        void Add(Word word);
        void Update(Word word);
        void Delete(int id);
        void Save();
        List<Word> GetByIds(List<int> ids);

    }
}
