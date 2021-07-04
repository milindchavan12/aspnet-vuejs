using Autofac;
using Autofac.Builder;
using AspNet.VueJs.Sample.Web.Logger.Enricher;

namespace AspNet.VueJs.Sample.Web
{
    public static class AutofacCorrellationIdExtension
    {
        public static IRegistrationBuilder<TLimit, TActivatorData, TRegistrationStyle> SetBaseAdministrationServicePropertiesOnActivated<TLimit, TActivatorData, TRegistrationStyle>
            (this IRegistrationBuilder<TLimit, TActivatorData, TRegistrationStyle> builder, string ivtBaseUrl)
            where TLimit : BaseAdministrationClientBase
        {
            return builder
                    .OnActivated(e => e.Instance.CorrelationIdKey = "Correlation-Id")
                    .OnActivated(e => e.Instance.CorrelationIdValue = e.Context.Resolve<ICorrelationIdExtractor>().GetCorrelationId());
        }
    }
}