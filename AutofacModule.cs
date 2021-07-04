using Autofac;
using AutoMapper;
using AspNet.VueJs.Sample.Application.BaseAdministrations;
using AspNet.VueJs.Sample.Application.Config;
using AspNet.VueJs.Sample.Application.LegacyServices;
using AspNet.VueJs.Sample.Web.Logger.Enricher;
using System.Net.Http;

namespace AspNet.VueJs.Sample.Web
{
    public class AutofacModule : Module
    {
        private readonly DomainServiceEndPointsConfig _domainServiceEndPointsConfig;

        public AutofacModule(DomainServiceEndPointsConfig doMainServiceEndPointsConfig)
        {
            _domainServiceEndPointsConfig = doMainServiceEndPointsConfig;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(
                    ctx =>
                    {
                        var scope = ctx.Resolve<ILifetimeScope>();
                        return new Mapper(
                            ctx.Resolve<IConfigurationProvider>(),
                            scope.Resolve);
                    })
                .As<IMapper>()
                .InstancePerLifetimeScope();

            builder.RegisterType<CorrelationIdExtractor>()
                .As<ICorrelationIdExtractor>()
                .SingleInstance();

            ConfigureBaseAdministrationService(builder);

            ConfigureLegacyService(builder);
        }

        public virtual void ConfigureBaseAdministrationService(ContainerBuilder builder)
        {
            builder.RegisterType<OnboardingClient>()
                .As<IOnboardingClient>()
                .WithParameter("baseUrl", _domainServiceEndPointsConfig.BaseAdministrationServiceUrl)
                .SetBaseAdministrationServicePropertiesOnActivated(_domainServiceEndPointsConfig.BaseAdministrationServiceUrl);

            builder.RegisterType<OnboardingService>()
                .As<IOnboardingService>()
                .InstancePerLifetimeScope();

            builder.RegisterType<LookupClient>()
                .As<ILookupClient>()
                .WithParameter("baseUrl", _domainServiceEndPointsConfig.BaseAdministrationServiceUrl)
                .SetBaseAdministrationServicePropertiesOnActivated(_domainServiceEndPointsConfig.BaseAdministrationServiceUrl);

            builder.RegisterType<LookupService>()
                .As<ILookupService>()
                .InstancePerLifetimeScope();
        }

        public virtual void ConfigureLegacyService(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationClient>()
                .As<IApplicationClient>()
                .WithParameter("baseUrl", _domainServiceEndPointsConfig.LegacyServiceUrl)
                .WithParameter("httpClient", new HttpClient());

            builder.RegisterType<ApplicationService>()
                .As<IApplicationService>()
                .InstancePerLifetimeScope();
        }
    }
}
