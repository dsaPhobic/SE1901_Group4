using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class PasswordResetOtp
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(6)]
        public string OtpCode { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
    public DateTime ExpiresAt { get; set; }
    
    public bool IsUsed { get; set; } = false;
    
    public string? ResetToken { get; set; }
    
    public DateTime? ResetTokenExpires { get; set; }
    }
}
