namespace WebAPI.DTOs
{
    public class UserDTO
    {
          public int UserId { get; set; }
        public string Username { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string Role { get; set; } = "user";
        public string? Avatar { get; set; }
    }
  
}
