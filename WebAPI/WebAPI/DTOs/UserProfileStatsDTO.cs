namespace WebAPI.DTOs
{
    public class UserProfileStatsDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int TotalPosts { get; set; }
        public int TotalVotes { get; set; }
    }
}
