using WebAPI.Models;
using System.Collections.Generic;

namespace WebAPI.Repositories
{
    public interface IWritingRepository
    {
        Writing? GetById(int id);
        List<Writing> GetByExamId(int examId);
        void Add(Writing writing);
        void Update(Writing writing);
        void Delete(Writing writing);
        void SaveChanges();
    }
}
