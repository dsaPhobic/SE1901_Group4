using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IReadingService
    {
        ReadingDto? GetById(int id);
        List<ReadingDto> GetByExam(int examId);
        ReadingDto Create(CreateReadingDto dto);
        ReadingDto? Update(int id, UpdateReadingDto dto);
        bool Delete(int id);
    }
}
