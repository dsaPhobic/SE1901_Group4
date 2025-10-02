using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Services;
using WebAPI.DTOs;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/vocabgroups")]
    public class VocabGroupsController : ControllerBase
    {
        private readonly IVocabGroupService _groupService;
        private readonly IWordService _wordService;
        private readonly IUserService _userService;

        public VocabGroupsController(
            IVocabGroupService groupService,
            IWordService wordService,
            IUserService userService)
        {
            _groupService = groupService;
            _wordService = wordService;
            _userService = userService;
        }

        [HttpGet("{id}")]
        public ActionResult<VocabGroupDto> GetById(int id)
        {
            var group = _groupService.GetById(id);
            if (group == null) return NotFound();

            return Ok(ToDto(group));
        }

        [HttpGet("/api/users/{userId}/vocabgroups")]
        public ActionResult<IEnumerable<VocabGroupDto>> GetByUser(int userId, [FromQuery] string? name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var group = _groupService.GetByName(userId, name);
                return group == null ? NotFound() : Ok(ToDto(group));
            }

            var groups = _groupService.GetByUser(userId);
            return Ok(groups.Select(ToDto));
        }

        [HttpGet("{id}/words/count")]
        public ActionResult<int> CountWords(int id)
        {
            return Ok(_groupService.CountWords(id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] VocabGroupDto dto)
        {
            if (!_userService.Exists(dto.UserId))
                return BadRequest("Invalid UserId");

            var words = _wordService.GetByIds(dto.WordIds).ToList();

            var group = new VocabGroup
            {
                Groupname = dto.Groupname,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow,
                Words = words
            };

            _groupService.Add(group);

            dto.GroupId = group.GroupId;
            dto.CreatedAt = group.CreatedAt;

            return CreatedAtAction(nameof(GetById), new { id = group.GroupId }, dto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] VocabGroupDto dto)
        {
            if (id != dto.GroupId) return BadRequest();

            var group = _groupService.GetById(id);
            if (group == null) return NotFound();

            if (!_userService.Exists(dto.UserId))
                return BadRequest("Invalid UserId");

            var words = _wordService.GetByIds(dto.WordIds).ToList();

            group.Groupname = dto.Groupname;
            group.UserId = dto.UserId;
            group.Words = words;

            _groupService.Update(group);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _groupService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("{id}/words")]
        public ActionResult<List<WordDto>> GetWordsInGroup(int id)
        {
            var group = _groupService.GetById(id);
            if (group == null) return NotFound();

            var words = group.Words.Select(w => new WordDto
            {
                WordId = w.WordId,
                Term = w.Term,
                Meaning = w.Meaning,
                Example = w.Example,
                Audio = w.Audio
            });

            return Ok(words);
        }
        [HttpDelete("{groupId}/words/{wordId}")]
        public IActionResult RemoveWordFromGroup(int groupId, int wordId)
        {
            var group = _groupService.GetById(groupId);
            if (group == null) return NotFound(new { message = "Group not found" });

            var word = group.Words.FirstOrDefault(w => w.WordId == wordId);
            if (word == null) return NotFound(new { message = "Word not in this group" });

            // Xóa word khỏi group
            group.Words.Remove(word);
            _groupService.Update(group);

            return NoContent();
        }
        // Helper mapping
        private static VocabGroupDto ToDto(VocabGroup group) =>
            new VocabGroupDto
            {
                
                GroupId = group.GroupId,
                Groupname = group.Groupname,
                UserId = group.UserId,
                CreatedAt = group.CreatedAt,
                WordIds = group.Words.Select(w => w.WordId).ToList()
            };
        [HttpPost("{groupId}/words/{wordId}")]
        public IActionResult AddWordToGroup(int groupId, int wordId)
        {
            var group = _groupService.GetById(groupId);
            if (group == null)
                return NotFound(new { message = "Group not found" });

            var word = _wordService.GetById(wordId);
            if (word == null)
                return NotFound(new { message = "Word not found" });

            if (group.Words.Any(w => w.WordId == wordId))
                return BadRequest(new { message = "Word already exists in this group" });

            group.Words.Add(word);
            _groupService.Update(group);

            return Ok(new { message = $"Word '{word.Term}' added to group '{group.Groupname}'" });
        }

    }
}
