using AspNet.VueJs.Sample.Web.Logger;
using Microsoft.AspNetCore.Hosting;
using Serilog;

namespace AspNet.VueJs.Sample.Web.Extensions
{
    public static class LoggerExtensions
    {
        public static IWebHostBuilder ConfigureSerilog(this IWebHostBuilder hostBuilder)
        {
            return hostBuilder.UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
                    .ReadFrom.Configuration(hostingContext.Configuration)
                    .Enrich.FromLogContext()
                    .Enrich.WithCorrelationIdHeader()
                    .Enrich.WithThreadId()
                    .Enrich.WithMachineName()
                );
        }
    }
}

