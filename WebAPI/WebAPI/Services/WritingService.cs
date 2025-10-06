using System;
using System.Collections.Generic;
using System.Linq;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class WritingService : IWritingService
    {
        private readonly IWritingRepository _repo;

        public WritingService(IWritingRepository repo)
        {
            _repo = repo;
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
                WritingType = dto.WritingType,
                DisplayOrder = dto.DisplayOrder,
                CreatedAt = DateTime.UtcNow
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
            if (dto.WritingType != null) existing.WritingType = dto.WritingType;
            if (dto.DisplayOrder > 0) existing.DisplayOrder = dto.DisplayOrder;

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

        private static WritingDTO MapToDto(Writing w) =>
            new WritingDTO
            {
                WritingId = w.WritingId,
                ExamId = w.ExamId,
                WritingQuestion = w.WritingQuestion,
                WritingType = w.WritingType,
                DisplayOrder = w.DisplayOrder,
                CreatedAt = w.CreatedAt
            };
    }
}
