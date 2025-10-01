using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IVocabGroupRepository
    {
        void Add(VocabGroup vocabGroup);
        void Update(VocabGroup vocabGroup);
        void Delete(VocabGroup vocabGroup);

        void SaveChanges();
        VocabGroup GetById(int groupId);
        IEnumerable<VocabGroup> GetByUser(int userId); 
        VocabGroup GetByName(int userId, string groupName);
        bool ExistsForUser(int userId, string groupName); // prevent duplicate groups
        int CountWords(int groupId); // how many words in group
    }
}
