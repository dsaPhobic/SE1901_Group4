using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IUserRepository
    {
        User? GetByEmail(string email);
        User? GetById(int id);

        void Add(User user);
        void Update(User user);
        void Delete(User user);
        void SaveChanges();
    }
}
