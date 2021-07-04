using AspNet.VueJs.Sample.Web.Middleware;
using Microsoft.AspNetCore.Builder;

namespace AspNet.VueJs.Sample.Web.Extensions
{
    public static class HttpHandlerExtensions
    {
        public static IApplicationBuilder UseHttpHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpHandlerMiddleware>();
        }
    }
}
