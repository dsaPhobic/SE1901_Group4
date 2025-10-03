using WebAPI.DTOs;

namespace WebAPI.Repositories
{
    public interface IDashboardRepository
    {
        List<ExamAttemptSummaryDTO> GetExamAttemptsByUser(int userId);
        ExamAttemptDetailDTO? GetExamAttemptDetail(long attemptId);
    }
}
