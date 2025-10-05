using System.Collections.Generic;
using System.Linq;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;
        public UserRepository(ApplicationDbContext db) => _db = db;

        public User? GetByEmail(string email) => _db.User.FirstOrDefault(u => u.Email == email);
        public User? GetById(int id) => _db.User.FirstOrDefault(u => u.UserId == id);
        public IEnumerable<User> GetAll() => _db.User.ToList();
        public bool Exists(int userId) => _db.User.Any(u => u.UserId == userId);
        public void Add(User user) => _db.User.Add(user);
        public void Update(User user) => _db.User.Update(user);
        public void Delete(User user) => _db.User.Remove(user);
        public void SaveChanges() => _db.SaveChanges();
    }
}
