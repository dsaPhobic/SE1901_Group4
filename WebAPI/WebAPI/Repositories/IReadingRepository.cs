using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IReadingRepository
    {
        Reading? GetById(int id);
        List<Reading> GetByExamId(int examId);
        void Add(Reading reading);
        void Update(Reading reading);
        void Delete(Reading reading);
        void SaveChanges();
    }
}
