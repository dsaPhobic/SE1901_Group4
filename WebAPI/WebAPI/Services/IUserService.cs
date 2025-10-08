using System.Collections.Generic;
using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IUserService
    {
        User? GetById(int id);
        User? GetByEmail(string email);
        IEnumerable<User> GetAll();
        bool Exists(int userId);

        User Register(RegisterRequestDTO dto);
        User? Authenticate(string email, string password);

        void Update(int id, UpdateUserDTO dto, int currentUserId);
        void Update(User user);
        void Delete(int id, int currentUserId);
        User RegisterAdmin(RegisterRequestDTO dto);
        
        // Moderator methods
        IEnumerable<UserStatsDTO> GetUsersWithStats(int page, int limit);
        UserStatsDTO? GetUserStats(int userId);
    }
}
