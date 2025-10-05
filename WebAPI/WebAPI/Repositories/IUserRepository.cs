using WebAPI.Models;
using System.Collections.Generic;

namespace WebAPI.Repositories
{
    public interface IUserRepository
    {
        User? GetByEmail(string email);
        User? GetById(int id);
        IEnumerable<User> GetAll();
        bool Exists(int userId);
        void Add(User user);
        void Update(User user);
        void Delete(User user);
        void SaveChanges();
    }
}
