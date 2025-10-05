using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IExamRepository
    {
        // Exam
        Exam? GetById(int id);
        List<Exam> GetAll();
        void Add(Exam exam);
        void Update(Exam exam);
        void Delete(Exam exam);

        // Attempt & Answer
        void AddAttempt(ExamAttempt attempt);

        // Save
        void SaveChanges();
        List<ExamAttemptDTO> GetExamAttemptsByUser(int userId);
        ExamAttemptDTO? GetExamAttemptDetail(long attemptId);
    }
}
