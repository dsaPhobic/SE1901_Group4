using WebAPI.DTOs;
using System.Collections.Generic;
using System.Text.Json;

namespace WebAPI.Services
{
    public interface IWritingService
    {
        WritingDTO? GetById(int id);
        List<WritingDTO> GetByExam(int examId);
        WritingDTO Create(WritingDTO dto);
        WritingDTO? Update(int id, WritingDTO dto);
        bool Delete(int id);

        JsonDocument GradeWriting(int examId, int userId, string answer);
    }
}
