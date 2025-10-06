using CloudinaryDotNet.Actions;
using OpenAI;
using OpenAI.Chat;
using System.Threading.Tasks;

namespace WebAPI.ExternalServices
{
    public class OpenAIService
    {
        private readonly OpenAIClient _client;

        public OpenAIService(IConfiguration config)
        {
            var apiKey = config["OpenAI:ApiKey"];
            _client = new OpenAIClient(apiKey);
        }

//        public async Task<string> GradeWritingAsync(string question, string answer)
//        {
//            string prompt = $@"
//You are an IELTS examiner. Grade the following writing task.
//Provide band scores (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar),
//and give short feedback.

//### Question:
//{question}

//### Student's answer:
//{answer}

//Return result strictly in JSON format like this:
//{{
//  ""taskAchievement"": 7.0,
//  ""coherenceAndCohesion"": 7.5,
//  ""lexicalResource"": 6.5,
//  ""grammar"": 7.0,
//  ""overall"": 7.0,
//  ""feedback"": ""Clear structure, but vocabulary range can be improved.""
//}}
//";

//            var chatRequest = new ChatRequest(
//                new[]
//                {
//                    new Message(Role.System, "You are an IELTS examiner."),
//                    new Message(Role.User, prompt)
//                },
//                model: "gpt-4o-mini" // hoặc "gpt-4-turbo"
//            );

//            var response = await _client.ChatEndpoint.GetCompletionAsync(chatRequest);
//            return response.FirstChoice.Message.Content[0].Text;
//        }
        }
}
