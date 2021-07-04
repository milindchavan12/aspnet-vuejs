using AspNet.VueJs.Sample.Application.LegacyServices;
using AspNet.VueJs.Sample.Application.LegacyServices.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;
using AspNet.VueJs.Sample.Web.Extensions;

namespace AspNet.VueJs.Sample.Web.Middleware
{
    public class HttpHandlerMiddleware
    {
        private readonly RequestDelegate _requestDelegate;
        private readonly IApplicationService _applicationService;

        public HttpHandlerMiddleware(RequestDelegate requestDelegate, IApplicationService applicationService)
        {
            _requestDelegate = requestDelegate;
            _applicationService = applicationService;
        }

        public async Task Invoke(HttpContext context)
        {
            string userName = HttpCurrentContext.UserName;
            CanAccessOnboardingResponse response = await CanAccess(userName);
            if (response == null || response?.Success == false)
            {
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync($"{userName} is not allowed to access Onboarding App");
            }
            else
            {
                context.Items["PersonFid"] = response.PersonFid;
                await _requestDelegate(context);
            }
        }

        private async Task<CanAccessOnboardingResponse> CanAccess(string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                return await Task.FromResult<CanAccessOnboardingResponse>(null);
            }

            try
            {
                return await _applicationService.CanAccessOnboardingsAsync(userName, CancellationToken.None);
            }
            catch (Exception)
            {
                return await Task.FromResult<CanAccessOnboardingResponse>(null);
            }
        }
    }
}
