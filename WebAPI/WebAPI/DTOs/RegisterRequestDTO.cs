using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class RegisterRequestDTO
    {
        [Required]
        public string Username { get; init; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; init; } = string.Empty;
        public string Role { get; set; } = "user"; 

        public string? Firstname { get; init; }
        public string? Lastname { get; init; }
    }
}