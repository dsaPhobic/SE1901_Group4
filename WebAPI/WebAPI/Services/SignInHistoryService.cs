using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Services
{
    public class SignInHistoryService : ISignInHistoryService
    {
        private readonly ApplicationDbContext _context;

        public SignInHistoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void LogSignIn(int userId, string? ipAddress, string? deviceInfo)
        {
            var history = new UserSignInHistory
            {
                UserId = userId,
                IpAddress = ipAddress,
                DeviceInfo = deviceInfo,
                SignedInAt = DateTime.UtcNow
            };

            _context.UserSignInHistory.Add(history);
            _context.SaveChanges();
        }

        public IEnumerable<UserSignInHistory> GetUserHistory(int userId, int limit = 30)
        {
            return _context.UserSignInHistory
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.SignedInAt)
                .Take(limit)
                .ToList();
        }
    }
}
