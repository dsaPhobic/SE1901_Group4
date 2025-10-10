using OpenAI;
using OpenAI.Chat;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace WebAPI.ExternalServices
{
    public class OpenAIService
    {
        private readonly OpenAIClient _client;
        private readonly ILogger<OpenAIService> _logger;

        public OpenAIService(IConfiguration config, ILogger<OpenAIService> logger)
        {
            var apiKey = config["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                throw new ArgumentException("OpenAI API key is not configured.");

            _client = new OpenAIClient(apiKey);
            _logger = logger;
        }

        public JsonDocument GradeWriting(string question, string answer)
        {
            string prompt = $@"
You are an IELTS Writing examiner and English teacher...
### Essay Question:
{question}

### Student's Answer:
{answer}";

            try
            {
                var chatClient = _client.GetChatClient("gpt-4o-mini");

                // ✅ Dùng mảng kiểu rõ ràng
                var messages = new ChatMessage[]
                {
                    new SystemChatMessage("You are an IELTS Writing examiner."),
                    new UserChatMessage(prompt)
                };

                // ✅ Gọi đồng bộ (không async/await)
                var result = chatClient.CompleteChat(messages);

                // ✅ Lấy text từ Value.Content
                var jsonText = result.Value.Content[0].Text ?? "{}";
                return JsonDocument.Parse(jsonText);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse JSON from OpenAI");
                return JsonDocument.Parse($"{{\"error\":\"Invalid JSON returned from OpenAI\",\"raw\":\"{ex.Message}\"}}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OpenAI call failed");
                return JsonDocument.Parse($"{{\"error\":\"{ex.Message}\"}}");
            }
        }
    }
}
