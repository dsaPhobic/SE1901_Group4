using System;
using System.Collections.Generic;
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

        public User Register(RegisterRequestDTO dto)
        {
            var exists = _repo.GetByEmail(dto.Email);
            if (exists != null) throw new InvalidOperationException("Email đã được sử dụng");

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

        public User? Authenticate(string email, string password)
        {
            var user = _repo.GetByEmail(email);
            if (user == null) return null;
            if (!PasswordService.VerifyPassword(password, user.PasswordHash, user.PasswordSalt)) return null;
            return user;
        }

        public void Update(int id, UpdateUserDTO dto, int currentUserId)
        {
            var user = _repo.GetById(id) ?? throw new KeyNotFoundException("Không tìm thấy user");
            var currentUser = _repo.GetById(currentUserId) ?? throw new UnauthorizedAccessException("Không tìm thấy user hiện tại");

            if (currentUser.UserId != id && currentUser.Role != "admin")
                throw new UnauthorizedAccessException("Không có quyền cập nhật user này");

            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
            {
                var byEmail = _repo.GetByEmail(dto.Email);
                if (byEmail != null && byEmail.UserId != id) throw new InvalidOperationException("Email đã được sử dụng");
                user.Email = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.Firstname)) user.Firstname = dto.Firstname;
            if (!string.IsNullOrWhiteSpace(dto.Lastname)) user.Lastname = dto.Lastname;

            if (!string.IsNullOrWhiteSpace(dto.Role) && currentUser.Role == "admin")
            {
                user.Role = dto.Role;
            }

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

        public void Delete(int id, int currentUserId)
        {
            var user = _repo.GetById(id) ?? throw new KeyNotFoundException("Không tìm thấy user");
            var currentUser = _repo.GetById(currentUserId) ?? throw new UnauthorizedAccessException("Không tìm thấy user hiện tại");

            if (currentUser.UserId != id && currentUser.Role != "admin")
                throw new UnauthorizedAccessException("Không có quyền xóa user này");

            _repo.Delete(user);
            _repo.SaveChanges();
        }
    }
}
