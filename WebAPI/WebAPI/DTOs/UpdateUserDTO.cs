using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class UpdateUserDTO
    {
        [EmailAddress]
        public string? Email { get; init; }

        [MinLength(6)]
        public string? Password { get; init; }

        public string? Firstname { get; init; }
        public string? Lastname { get; init; }

        // Only writable by admin; controller/service enforces this
        public string? Role { get; init; }
    }
}