using WebAPI.Models;

namespace WebAPI.Services
{
    public interface ISignInHistoryService
    {
        void LogSignIn(int userId, string? ipAddress, string? deviceInfo);
        IEnumerable<UserSignInHistory> GetUserHistory(int userId, int limit = 30);
    }
}
