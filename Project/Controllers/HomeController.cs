using Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Project.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        //this method will save the repositories that the customers want to book
        public bool Book(Repository data)
        {
            var List = (List<Repository>)Session["reps"];

            //if the list doesn't exist(first time saving a rep) then a new list will be created.
            if (List == null)
                List = new List<Repository>();
            

            //checking if the rep is saved in order to avoid saving it twice.
            var match = List.FirstOrDefault(element => element.Id == data.Id);
            if (match != null)
                return false;

            //saving the data in a session
            List.Add(data);
            Session["reps"] = List;

            return true;
        }

        public ActionResult ShowBookedRep()
        {
            //sending the view the saved repository list.
            var List = (List<Repository>)Session["reps"];
            if (List == null)
                List = new List<Repository>();


            return View(List);
        }
    }
}