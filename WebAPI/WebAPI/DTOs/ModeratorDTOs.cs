using System;

namespace WebAPI.DTOs
{
    public class ModeratorStatsDTO
    {
        public int TotalPosts { get; set; }
        public int PendingPosts { get; set; }
        public int ReportedPosts { get; set; }
        public int RejectedPosts { get; set; }
    }

    public class ReportedPostDTO
    {
        public int PostId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string ReportReason { get; set; } = string.Empty;
        public int ReportCount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class UserStatsDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int ApprovedPosts { get; set; }
        public int RejectedPosts { get; set; }
        public int ReportedPosts { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ChartDataDTO
    {
        public string Label { get; set; } = string.Empty;
        public int Value { get; set; }
        public DateTime Date { get; set; }
    }

    public class NotificationDTO
    {
        public int NotificationId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


