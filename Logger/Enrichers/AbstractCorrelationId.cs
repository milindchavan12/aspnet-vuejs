using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace AspNet.VueJs.Sample.Web.Logger.Enricher
{
    public abstract class AbstractCorrelationId
    {
        public virtual string GetCorrelationId(HttpContext httpContext, string headerKey)
        {
            var header = string.Empty;

            if (httpContext.Request.Headers.TryGetValue(headerKey, out var values))
            {
                header = values.FirstOrDefault();
            }
            else if (httpContext.Response.Headers.TryGetValue(headerKey, out values))
            {
                header = values.FirstOrDefault();
            }

            var correlationId = string.IsNullOrEmpty(header)
                                    ? Guid.NewGuid().ToString()
                                    : header;

            if (!httpContext.Response.Headers.ContainsKey(headerKey))
            {
                httpContext.Response.Headers.Add(headerKey, correlationId);
            }

            return correlationId;
        }
    }
}