using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IListeningService
    {
        ListeningDto? GetById(int id);
        List<ListeningDto> GetByExam(int examId);
        ListeningDto Create(CreateListeningDto dto);
        ListeningDto? Update(int id, UpdateListeningDto dto);
        bool Delete(int id);
    }
}
