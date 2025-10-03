using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IDashboardService
    {
        List<ExamAttemptSummaryDTO> GetExamAttemptsByUser(int userId);
        ExamAttemptDetailDTO? GetExamAttemptDetail(long attemptId);
    }
}
