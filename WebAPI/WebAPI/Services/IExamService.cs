using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IExamService
    {
        Exam? GetById(int id);
        List<Exam> GetAll();
        List<Exam> GetByUser(int userId);

        Exam Create(CreateExamDTO exam);
        Exam? Update(int id, UpdateExamDTO exam);
        bool Delete(int id);

        ExamAttempt StartAttempt(int examId, int userId);
        void SubmitAttempt(int attemptId);

        List<ExamAttemptDTO> GetExamAttemptsByUser(int userId);
        ExamAttemptDTO? GetExamAttemptDetail(long attemptId);
    }
}
