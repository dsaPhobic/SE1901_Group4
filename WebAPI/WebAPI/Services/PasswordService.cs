using System.Security.Cryptography;
using System.Text;

namespace WebAPI.Services
{
    public  static class PasswordService
    {
        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
            using var hmac = new HMACSHA256();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
        public static bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt) {
            using var hmac = new HMACSHA256(storedSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computeHash.SequenceEqual(storedHash);
        
        }
    }
}
