using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Services;
using WebAPI.DTOs;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/words")]
    public class WordsController : ControllerBase
    {
        private readonly IWordService _wordService;

        public WordsController(IWordService wordService)
        {
            _wordService = wordService;
        }

        // GET api/words/5
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var word = _wordService.GetById(id);
            if (word == null) return NotFound();

            return Ok(ToDto(word));
        }

        // GET api/words?term=distort
        [HttpGet]
        public IActionResult GetByTerm([FromQuery] string? term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest("Term is required");

            var word = _wordService.GetByName(term);
            if (word == null) return NotFound();

            return Ok(ToDto(word));
        }

        // GET api/words/search?keyword=abc
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string keyword)
        {
            var results = _wordService.Search(keyword);
            return Ok(results.Select(ToDto));
        }

        // POST api/words
        [HttpPost]
        public IActionResult Add([FromBody] WordDto dto)
        {
            var word = new Word
            {
                Term = dto.Term,
                Meaning = dto.Meaning,
                Audio = dto.Audio,
                Example = dto.Example,
                Groups = dto.GroupIds.Select(id => new VocabGroup { GroupId = id }).ToList()
            };

            _wordService.Add(word);

            return CreatedAtAction(nameof(GetById), new { id = word.WordId }, ToDto(word));
        }

        // PUT api/words/5
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] WordDto dto)
        {
            var word = _wordService.GetById(id);
            if (word == null) return NotFound();

            word.Term = dto.Term;
            word.Meaning = dto.Meaning;
            word.Audio = dto.Audio;
            word.Example = dto.Example;
            word.Groups = dto.GroupIds.Select(gid => new VocabGroup { GroupId = gid }).ToList();

            _wordService.Update(word);
            return NoContent();
        }

        // DELETE api/words/5
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var word = _wordService.GetById(id);
            if (word == null) return NotFound();

            _wordService.Delete(id);
            return NoContent();
        }

        // GET api/words/{term}/lookup
        [HttpGet("{term}/lookup")]
        public IActionResult Lookup(string term)
        {
            var word = _wordService.LookupOrFetch(term);
            if (word == null) return NotFound();

            return Ok(ToDto(word));
        }

        // ===== Helper mapper =====
        private static WordDto ToDto(Word word) =>
            new WordDto
            {
                WordId = word.WordId,
                Term = word.Term,
                Meaning = word.Meaning,
                Audio = word.Audio,
                Example = word.Example,
                GroupIds = word.Groups?.Select(g => g.GroupId).ToList() ?? new List<int>()
            };
    }
}
