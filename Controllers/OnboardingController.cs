using AspNet.VueJs.Sample.Application.BaseAdministrations;
using AspNet.VueJs.Sample.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AspNet.VueJs.Sample.Web.Controllers
{
    public class OnboardingController : Controller
    {
        private readonly IOnboardingService _onboardingService;

        public OnboardingController(IOnboardingService onboardingService)
        {
            _onboardingService = onboardingService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("details/{onboardingId}")]
        public ActionResult Detail(int onboardingId)
        {
            return View("Details", onboardingId);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
