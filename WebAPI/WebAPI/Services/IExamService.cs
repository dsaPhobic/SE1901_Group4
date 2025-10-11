using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IExamService
    {
        Exam? GetById(int id);
        List<Exam> GetAll();

        Exam Create(CreateExamDto exam);
        Exam? Update(int id, UpdateExamDto exam);
        bool Delete(int id);

        ExamAttempt? GetAttemptById(long attemptId);
        List<ExamAttemptSummaryDto> GetExamAttemptsByUser(int userId);
        ExamAttemptDto? GetExamAttemptDetail(long attemptId);
        ExamAttempt SubmitAttempt(SubmitAttemptDto dto, int userId);
        void Save();
    }
}
