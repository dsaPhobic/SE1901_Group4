using System;
using System.Collections.Generic;
using System.Linq;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        public UserService(IUserRepository repo) => _repo = repo;

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
            if (user == null)
                throw new UnauthorizedAccessException("Account not found with this email address");
            
            if (!PasswordService.VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
                throw new UnauthorizedAccessException("Incorrect password");

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
            if (!string.IsNullOrWhiteSpace(dto.Avatar)) user.Avatar = dto.Avatar;

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
    }
}
