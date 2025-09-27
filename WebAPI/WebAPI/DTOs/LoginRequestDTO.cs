using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class LoginRequestDTO
    {

        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;
        [Required]
        public string Password { get; init; } = string.Empty;


    }
}
