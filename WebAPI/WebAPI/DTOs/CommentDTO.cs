using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.DTOs
{
    public class CommentDTO : Controller
    {
        // GET: CommentDTO
        public ActionResult Index()
        {
            return View();
        }

        // GET: CommentDTO/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: CommentDTO/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CommentDTO/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CommentDTO/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: CommentDTO/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CommentDTO/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: CommentDTO/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
