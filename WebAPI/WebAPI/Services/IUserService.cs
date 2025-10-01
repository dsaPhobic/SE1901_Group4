using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IUserService
    {
        User? GetById(int id);
        User? GetByEmail(string email);
        User Register(RegisterRequestDTO dto);
        User? Authenticate(string email, string password);
        void Update(int id, UpdateUserDTO dto, int currentUserId);
        void Delete(int id, int currentUserId);
        bool Exists(int userId);
    }
}
