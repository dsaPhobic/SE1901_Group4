using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IExamService
    {
        Exam? GetById(int id);
        List<Exam> GetAll();

        Exam Create(CreateExamDTO exam);
        Exam? Update(int id, UpdateExamDTO exam);
        bool Delete(int id);

        ExamAttempt? GetAttemptById(long attemptId);
        List<ExamAttemptSummaryDTO> GetExamAttemptsByUser(int userId);
        ExamAttemptDTO? GetExamAttemptDetail(long attemptId);
        ExamAttempt SubmitAttempt(int examId, int userId, string answerText, DateTime startedAt);
        void Save();
    }
}
