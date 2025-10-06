using WebAPI.Models;

namespace WebAPI.Repositories
{
    public interface IListeningRepository
    {
        Listening? GetById(int id);
        List<Listening> GetByExamId(int examId);
        void Add(Listening Listening);
        void Update(Listening Listening);
        void Delete(Listening Listening);
        void SaveChanges();
    }
}
