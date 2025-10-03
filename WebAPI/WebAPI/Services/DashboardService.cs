using WebAPI.DTOs;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public List<ExamAttemptSummaryDTO> GetExamAttemptsByUser(int userId)
        {
            return _repository.GetExamAttemptsByUser(userId);
        }

        public ExamAttemptDetailDTO? GetExamAttemptDetail(long attemptId)
        {
            return _repository.GetExamAttemptDetail(attemptId);
        }
    }
}
