using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IVocabGroupService
    {
        VocabGroup? GetById(int id);
        IEnumerable<VocabGroup> GetByUser(int userId);
        VocabGroup? GetByName(int userId, string groupName);
        bool ExistsForUser(int userId, string groupName);
        int CountWords(int groupId);

        void Add(VocabGroup group);
        void Update(VocabGroup group);
        void Delete(int id);
    }
}
