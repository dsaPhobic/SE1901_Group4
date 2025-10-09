using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IExamAttemptRepository
    {

        ExamAttempt? GetById(int id);

        List<ExamAttempt> GetByExamId(int examId);
        void Add(ExamAttempt ExamAttempt);
        void Update(ExamAttempt ExamAttempt);
        void Delete(ExamAttempt ExamAttempt);
        void SaveChanges();
    }
}
