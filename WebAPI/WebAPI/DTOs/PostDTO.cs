using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.DTOs
{
    public class PostDTO : Controller
    {
        // GET: PostDTO
        public ActionResult Index()
        {
            return View();
        }

        // GET: PostDTO/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PostDTO/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PostDTO/Create
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

        // GET: PostDTO/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PostDTO/Edit/5
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

        // GET: PostDTO/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PostDTO/Delete/5
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
