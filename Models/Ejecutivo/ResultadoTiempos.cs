using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class ResultadoTiempos
    {        
          public string? Indicador { get; set; }
          public TimeSpan? TiempoCuentas { get; set; }
          public TimeSpan? TiempoNegociaciones { get; set; }
          public TimeSpan? TiempoTitulares { get; set; }
          public TimeSpan? TiempoConocidos { get; set; }
          public TimeSpan? TiempoDesconocidos { get; set; }
          public TimeSpan? TiempoSinContacto { get; set; }
          public TimeSpan? TiempoPermiso { get; set; }
          public TimeSpan? TiempoCurso { get; set; }
          public TimeSpan? TiempoCalidad { get; set; }
          public TimeSpan? TiempoComida { get; set; }
          public TimeSpan? TiempoBaño { get; set; }



        //// GET: ResultadoTiempos
        //public ActionResult Index()
        //{
        //    return View();
        //}

        //// GET: ResultadoTiempos/Details/5
        //public ActionResult Details(int id)
        //{
        //    return View();
        //}

        //// GET: ResultadoTiempos/Create
        //public ActionResult Create()
        //{
        //    return View();
        //}

        //// POST: ResultadoTiempos/Create
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Create(IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: ResultadoTiempos/Edit/5
        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        //// POST: ResultadoTiempos/Edit/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Edit(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: ResultadoTiempos/Delete/5
        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        //// POST: ResultadoTiempos/Delete/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Delete(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
