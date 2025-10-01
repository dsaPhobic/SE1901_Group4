using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Services
{
    public class ICommentService : Controller
    {
        // GET: ICommentService
        public ActionResult Index()
        {
            return View();
        }

        // GET: ICommentService/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ICommentService/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ICommentService/Create
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

        // GET: ICommentService/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ICommentService/Edit/5
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

        // GET: ICommentService/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ICommentService/Delete/5
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
