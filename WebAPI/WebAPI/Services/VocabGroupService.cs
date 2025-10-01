using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class VocabGroupService : IVocabGroupService
    {
        private readonly IVocabGroupRepository _repo;

        public VocabGroupService(IVocabGroupRepository repo)
        {
            _repo = repo;
        }

        public VocabGroup? GetById(int id) => _repo.GetById(id);

        public IEnumerable<VocabGroup> GetByUser(int userId) => _repo.GetByUser(userId);

        public VocabGroup? GetByName(int userId, string groupName) => _repo.GetByName(userId, groupName);

        public bool ExistsForUser(int userId, string groupName) => _repo.ExistsForUser(userId, groupName);

        public int CountWords(int groupId) => _repo.CountWords(groupId);

        public void Add(VocabGroup group)
        {
            if (!_repo.ExistsForUser(group.UserId, group.Groupname))
            {
                _repo.Add(group);
                _repo.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("Group name already exists for this user.");
            }
        }

        public void Update(VocabGroup group)
        {
            _repo.Update(group);
            _repo.SaveChanges();
        }

        public void Delete(int id)
        {
            var group = _repo.GetById(id);
            if (group != null)
            {
                _repo.Delete(group);
                _repo.SaveChanges();
            }
            else
            {
                throw new KeyNotFoundException("Group not found.");
            }
        }
    }
}
