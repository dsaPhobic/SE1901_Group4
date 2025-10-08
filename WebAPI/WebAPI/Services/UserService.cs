using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;
using WebAPI.ExternalServices;
using WebAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly IEmailService _emailService;
        private readonly ApplicationDbContext _context;
        
        public UserService(IUserRepository repo, IEmailService emailService, ApplicationDbContext context)
        {
            _repo = repo;
            _emailService = emailService;
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

        public string SendPasswordResetOtp(string email)
        {
            Console.WriteLine($"Starting password reset for email: {email}");
            
            var user = _repo.GetByEmail(email);
            if (user == null)
            {
                Console.WriteLine($"User not found for email: {email}");
                throw new InvalidOperationException("No account found with this email address");
            }

            Console.WriteLine($"User found: {user.Username}");

            // Generate 6-digit OTP
            var random = new Random();
            var otpCode = random.Next(100000, 999999).ToString();
            Console.WriteLine($"Generated OTP: {otpCode}");

            // Invalidate any existing OTPs for this email
            var existingOtps = _context.PasswordResetOtp
                .Where(o => o.Email == email && !o.IsUsed)
                .ToList();
            
            foreach (var otp in existingOtps)
            {
                otp.IsUsed = true;
            }

            // Create new OTP
            var passwordResetOtp = new PasswordResetOtp
            {
                Email = email,
                OtpCode = otpCode,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10), // OTP expires in 10 minutes
                IsUsed = false
            };

            _context.PasswordResetOtp.Add(passwordResetOtp);
            _context.SaveChanges();
            Console.WriteLine($"OTP saved to database");

            // Send email
            Console.WriteLine($"Attempting to send email...");
            try
            {
                _emailService.SendOtpEmail(email, otpCode);
                Console.WriteLine($"Email sent successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
                throw;
            }

            return "OTP sent successfully to your email address";
        }

        public string VerifyOtp(string email, string otpCode)
        {
            var otp = _context.PasswordResetOtp
                .Where(o => o.Email == email && o.OtpCode == otpCode && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow)
                .FirstOrDefault();

            if (otp == null)
                throw new InvalidOperationException("Invalid or expired OTP");

            // Generate a secure reset token
            var resetToken = Guid.NewGuid().ToString();
            
            // Store the reset token in the OTP record
            otp.ResetToken = resetToken;
            otp.ResetTokenExpires = DateTime.UtcNow.AddMinutes(15); // Token valid for 15 minutes
            _context.SaveChanges();

            return resetToken;
        }

        public string ResetPassword(string email, string resetToken, string newPassword)
        {
            // Verify reset token
            var otp = _context.PasswordResetOtp
                .Where(o => o.Email == email && o.ResetToken == resetToken && !o.IsUsed && o.ResetTokenExpires > DateTime.UtcNow)
                .FirstOrDefault();

            if (otp == null)
                throw new InvalidOperationException("Invalid or expired reset token");

            // Get user
            var user = _repo.GetByEmail(email);
            if (user == null)
                throw new InvalidOperationException("User not found");

            // Update password
            PasswordService.CreatePasswordHash(newPassword, out var hash, out var salt);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;
            user.UpdatedAt = DateTime.UtcNow;

            _repo.Update(user);
            
            // Mark OTP as used
            otp.IsUsed = true;
            otp.ResetToken = null; // Clear the token
            otp.ResetTokenExpires = null;
            
            _context.SaveChanges();

            return "Password reset successfully";
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
