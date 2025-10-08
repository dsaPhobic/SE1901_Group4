using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class ForgotPasswordRequestDTO
    {
        [Required]
        [EmailAddress]
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "nvarchar(150)")]
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string OtpCode { get; set; } = string.Empty;
    }

    public class ResetPasswordRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string ResetToken { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
