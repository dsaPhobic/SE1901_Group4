using System;
using System.Net;

namespace WebAPI.ExternalServices
{
    public static class ImageHelper
    {
        public static string? GetBase64FromUrl(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return null;

            try
            {
                using (var webClient = new WebClient())
                {
                    var bytes = webClient.DownloadData(imageUrl);
                    string base64 = Convert.ToBase64String(bytes);
                    return base64;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ImageHelper] Failed to convert image: {ex.Message}");
                return null;
            }
        }
    }
}
