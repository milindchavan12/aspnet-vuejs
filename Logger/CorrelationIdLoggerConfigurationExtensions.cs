using AspNet.VueJs.Sample.Web.Logger.Enrichers;
using Serilog;
using Serilog.Configuration;
using System;

namespace AspNet.VueJs.Sample.Web.Logger
{
    public static class CorrelationIdLoggerConfigurationExtensions
    {
        public static LoggerConfiguration WithCorrelationId(this LoggerEnrichmentConfiguration enrichmentConfiguration)
        {
            if (enrichmentConfiguration == null)
            {
                throw new ArgumentNullException(nameof(enrichmentConfiguration));
            } 
            return enrichmentConfiguration.With<CorrelationIdEnricher>();
        }

        public static LoggerConfiguration WithCorrelationIdHeader(this LoggerEnrichmentConfiguration enrichmentConfiguration, string headerKey = "Correlation-Id")
        {
            if (enrichmentConfiguration == null)
            {
                throw new ArgumentNullException(nameof(enrichmentConfiguration));
            }
            return enrichmentConfiguration.With(new CorrelationIdHeaderEnricher(headerKey));
        }
    }
}
