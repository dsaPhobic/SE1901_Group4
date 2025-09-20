using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public class UserRepo : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.User.ToList();
        }

        public User? GetById(int id)
        {
            return _context.User.Find(id);
        }
        public void Add(User user)
        {
            _context.User.Add(user);
        }
        public void Update(User user)
        {
            _context.User.Update(user);
        }

        public void Delete(int id)
        {
            var user = _context.User.Find(id);
            if (user != null)
            {
                _context.User.Remove(user);
            }
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}