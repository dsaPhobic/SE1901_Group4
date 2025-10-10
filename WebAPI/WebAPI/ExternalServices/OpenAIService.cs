using OpenAI;
using OpenAI.Chat;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ClientModel;

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

        /// <summary>
        /// Grade an IELTS Writing Task (Task 1 or Task 2) and return structured JSON feedback.
        /// Supports image-based Task 1 via base64 image embedding.
        /// </summary>
        public JsonDocument GradeWriting(string question, string answer, string? imageUrl = null)
        {
            try
            {
                var chatClient = _client.GetChatClient("gpt-4o-mini");

                // === Step 1. Base64 convert (if image provided)
                string? base64 = null;
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    try
                    {
                        base64 = ImageHelper.GetBase64FromUrl(imageUrl);
                        if (base64 != null)
                            _logger.LogInformation("[OpenAIService] Image converted to base64 successfully.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "[OpenAIService] Failed to convert image URL.");
                    }
                }

                // === Step 2. Create messages
                var messages = new List<ChatMessage>
                {
                    new SystemChatMessage("You are an IELTS Writing examiner.")
                };

                if (base64 != null)
                {
                    // === If image present, send with question + image + answer
                    messages.Add(ChatMessage.CreateUserMessage(
                        ChatMessageContentPart.CreateTextPart($"### Essay Question:\n{question}\n\n(Analyze this image and writing response.)"),
                        ChatMessageContentPart.CreateImagePart(BinaryData.FromBytes(Convert.FromBase64String(base64)), "image/png"),
                        ChatMessageContentPart.CreateTextPart($"### Student's Answer:\n{answer}\n\nNow provide structured JSON feedback as per instructions.")
                    ));
                }
                else
                {
                    // === If no image, text only
                    string prompt = $@"
You are an experienced IELTS Writing examiner and English language coach.
Your task is to evaluate the student's writing response in a structured JSON format.

### Essay Question:
{question}

### Student's Answer:
{answer}

### Instructions:
Analyze the essay carefully and produce a **JSON** object with the following structure:

{{
  ""grammar_vocab"": {{
    ""overview"": ""Short summary of grammar and vocabulary performance (2–3 sentences)."",
    ""errors"": [
      {{
        ""type"": ""Grammar"" or ""Vocabulary"",
        ""category"": ""e.g. Singular/Plural, Word choice, Word structure, Collocation"",
        ""incorrect"": ""the wrong phrase"",
        ""suggestion"": ""the corrected version"",
        ""explanation"": ""why it's wrong and how to fix it""
      }}
    ]
  }},
  ""coherence_logic"": {{
    ""overview"": ""General comments on task achievement, coherence and cohesion (2–3 sentences)."",
    ""paragraph_feedback"": [
      {{
        ""section"": ""Introduction"" or ""Body 1"" or ""Body 2"" or ""Overview"",
        ""strengths"": [""clear topic sentence"", ""logical data grouping""],
        ""weaknesses"": [""lacking comparison"", ""limited linking devices""],
        ""advice"": ""Specific tips for improving structure or flow""
      }}
    ]
  }},
  ""band_estimate"": {{
    ""task_achievement"": 0–9,
    ""coherence_cohesion"": 0–9,
    ""lexical_resource"": 0–9,
    ""grammar_accuracy"": 0–9,
    ""overall"": 0–9
  }}
}}

⚠️ Important:
- Output **only valid JSON**, no explanations or commentary outside the JSON.
- Provide concrete examples inside each list (3–6 grammar/vocab errors minimum).
- Use concise academic English.";

                    messages.Add(new UserChatMessage(prompt));
                }

                // === Step 3. Call OpenAI
                var result = chatClient.CompleteChat(messages);

                // === Step 4. Extract JSON safely
                var raw = result.Value.Content[0].Text ?? "{}";
                int first = raw.IndexOf('{');
                int last = raw.LastIndexOf('}');
                string jsonText = (first >= 0 && last > first)
                    ? raw.Substring(first, last - first + 1)
                    : "{}";

                return JsonDocument.Parse(jsonText);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse JSON from OpenAI output.");
                return JsonDocument.Parse($@"{{ ""error"": ""Invalid JSON returned from OpenAI"", ""details"": ""{ex.Message}"" }}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OpenAI call failed.");
                return JsonDocument.Parse($@"{{ ""error"": ""{ex.Message}"" }}");
            }
        }
    }
}