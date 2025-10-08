using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly ApplicationDbContext _context;
        public UserService(IUserRepository repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public User? GetById(int id) => _repo.GetById(id);
        public User? GetByEmail(string email) => _repo.GetByEmail(email);
        public IEnumerable<User> GetAll() => _repo.GetAll();
        public bool Exists(int userId) => _repo.Exists(userId);

        public User Register(RegisterRequestDTO dto)
        {
            if (_repo.GetByEmail(dto.Email) != null)
                throw new InvalidOperationException("Email has already been used");

            PasswordService.CreatePasswordHash(dto.Password, out var hash, out var salt);

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Role = "user",
                CreatedAt = DateTime.UtcNow
            };

            _repo.Add(user);
            _repo.SaveChanges();
            return user;
        }

        public User RegisterAdmin(RegisterRequestDTO dto)
        {
            if (_repo.GetByEmail(dto.Email) != null)
                throw new InvalidOperationException("Email has already been used");

            PasswordService.CreatePasswordHash(dto.Password, out var hash, out var salt);

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };

            _repo.Add(user);
            _repo.SaveChanges();
            return user;
        }

        public User? Authenticate(string email, string password)
        {
            var user = _repo.GetByEmail(email);
            if (user == null || !PasswordService.VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        public void Update(int id, UpdateUserDTO dto, int currentUserId)
        {
            var user = _repo.GetById(id) ?? throw new KeyNotFoundException("User not found");
            var currentUser = _repo.GetById(currentUserId) ?? throw new UnauthorizedAccessException("Current user not found");

            if (currentUser.UserId != id && currentUser.Role != "admin")
                throw new UnauthorizedAccessException("You do not have permission to update this user");

            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
            {
                var existing = _repo.GetByEmail(dto.Email);
                if (existing != null && existing.UserId != id)
                    throw new InvalidOperationException("Email has already been used");
                user.Email = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.Firstname)) user.Firstname = dto.Firstname;
            if (!string.IsNullOrWhiteSpace(dto.Lastname)) user.Lastname = dto.Lastname;
            if (!string.IsNullOrWhiteSpace(dto.Username)) user.Username = dto.Username;

            if (!string.IsNullOrWhiteSpace(dto.Role) && currentUser.Role == "admin")
                user.Role = dto.Role;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                PasswordService.CreatePasswordHash(dto.Password, out var hash, out var salt);
                user.PasswordHash = hash;
                user.PasswordSalt = salt;
            }

            user.UpdatedAt = DateTime.UtcNow;
            _repo.Update(user);
            _repo.SaveChanges();
        }

        public void Update(User user)
        {
            _repo.Update(user);
            _repo.SaveChanges();
        }

        public void Delete(int id, int currentUserId)
        {
            var user = _repo.GetById(id) ?? throw new KeyNotFoundException("User not found");
            var currentUser = _repo.GetById(currentUserId) ?? throw new UnauthorizedAccessException("Current user not found");

            if (currentUser.UserId != id && currentUser.Role != "admin")
                throw new UnauthorizedAccessException("You do not have permission to delete this user");

            _repo.Delete(user);
            _repo.SaveChanges();
        }

        // Moderator methods
        public IEnumerable<UserStatsDTO> GetUsersWithStats(int page, int limit)
        {
            var users = _context.User
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .Include(u => u.Reports)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return users.Select(user => new UserStatsDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                TotalPosts = user.Posts?.Count ?? 0,
                TotalComments = user.Comments?.Count ?? 0,
                ApprovedPosts = user.Posts?.Count(p => p.Status == "approved") ?? 0,
                RejectedPosts = user.Posts?.Count(p => p.Status == "rejected") ?? 0,
                ReportedPosts = user.Reports?.Count ?? 0,
                CreatedAt = user.CreatedAt
            });
        }

        public UserStatsDTO? GetUserStats(int userId)
        {
            var user = _context.User
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .Include(u => u.Reports)
                .FirstOrDefault(u => u.UserId == userId);
            
            if (user == null) return null;

            return new UserStatsDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                TotalPosts = user.Posts?.Count ?? 0,
                TotalComments = user.Comments?.Count ?? 0,
                ApprovedPosts = user.Posts?.Count(p => p.Status == "approved") ?? 0,
                RejectedPosts = user.Posts?.Count(p => p.Status == "rejected") ?? 0,
                ReportedPosts = user.Reports?.Count ?? 0,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
