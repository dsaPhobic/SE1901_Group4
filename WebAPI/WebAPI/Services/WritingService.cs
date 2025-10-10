using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;
using WebAPI.ExternalServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace WebAPI.Services
{
    public class WritingService : IWritingService
    {
        private readonly IWritingRepository _repo;
        private readonly OpenAIService _openAI;

        public WritingService(IWritingRepository repo, OpenAIService openAI)
        {
            _repo = repo;
            _openAI = openAI;
        }

        public WritingDTO? GetById(int id)
        {
            var w = _repo.GetById(id);
            return w == null ? null : MapToDto(w);
        }

        public List<WritingDTO> GetByExam(int examId)
        {
            return _repo.GetByExamId(examId).Select(MapToDto).ToList();
        }

        public WritingDTO Create(WritingDTO dto)
        {
            var entity = new Writing
            {
                ExamId = dto.ExamId,
                WritingQuestion = dto.WritingQuestion,
                DisplayOrder = dto.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                ImageUrl = dto.ImageUrl
            };
            _repo.Add(entity);
            _repo.SaveChanges();
            return MapToDto(entity);
        }

        public WritingDTO? Update(int id, WritingDTO dto)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return null;

            if (dto.WritingQuestion != null) existing.WritingQuestion = dto.WritingQuestion;
            if (dto.DisplayOrder > 0) existing.DisplayOrder = dto.DisplayOrder;
            if (dto.ImageUrl != null) existing.ImageUrl = dto.ImageUrl;

            _repo.Update(existing);
            _repo.SaveChanges();
            return MapToDto(existing);
        }

        public bool Delete(int id)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return false;
            _repo.Delete(existing);
            _repo.SaveChanges();
            return true;
        }

        public JsonDocument GradeWriting(int examId, int userId, string answer)
        {
            var question = _repo.GetByExamId(examId).FirstOrDefault()?.WritingQuestion;
            if (string.IsNullOrEmpty(question))
                throw new Exception("No writing question found for this exam.");

            var feedback = _openAI.GradeWriting(question, answer);

            return feedback;
        }

        private static WritingDTO MapToDto(Writing w) =>
            new WritingDTO
            {
                WritingId = w.WritingId,
                ExamId = w.ExamId,
                WritingQuestion = w.WritingQuestion,
                DisplayOrder = w.DisplayOrder,
                CreatedAt = w.CreatedAt,
                ImageUrl = w.ImageUrl
            };
    }
}
