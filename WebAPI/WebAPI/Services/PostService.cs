using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Services
{
    public class PostService : Controller
    {
        // GET: PostService
        public ActionResult Index()
        {
            return View();
        }

        // GET: PostService/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PostService/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PostService/Create
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

        // GET: PostService/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PostService/Edit/5
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

        // GET: PostService/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PostService/Delete/5
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
