using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace AspNet.VueJs.Sample.Web.Logger.Enricher
{
    public class CorrelationIdExtractor : AbstractCorrelationId, ICorrelationIdExtractor
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly string _headerKey;

        public CorrelationIdExtractor(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
            _headerKey = "Correlation-Id";
        }

        public string GetCorrelationId()
        {
            return GetCorrelationId(_contextAccessor.HttpContext, _headerKey);
        }
    }
}