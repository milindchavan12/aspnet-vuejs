using System;
using Autofac;
using AutoMapper;
using AspNet.VueJs.Sample.Application.Config;
using AspNet.VueJs.Sample.Application.Mappings;
using AspNet.VueJs.Sample.Web.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AspNet.VueJs.Sample.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("OnboardingWebOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.Configure<IISOptions>(options =>
            {
                options.AutomaticAuthentication = true;
            });

            services.AddAuthentication(IISDefaults.AuthenticationScheme);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddHttpContextAccessor();
            services.AddAutoMapper(typeof(ApiMapProfile).Assembly);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Onboarding/Error");
            }

            app.UseAuthentication();

            app.UseCors("OnboardingWebOrigins");

            //Cache will be invalidated after one day
            var expiryPeriod = DateTime.Now.AddDays(1);
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add("cache-control", new[] { "public,max-age=" + (expiryPeriod - DateTime.Now).TotalSeconds });
                    context.Context.Response.Headers.Add("Expires", new[] { expiryPeriod.ToString("R") });
                }
            }); ;
            app.UseCookiePolicy();

            app.UseHttpHandler();
            HttpCurrentContext.Configure(app.ApplicationServices.
                GetRequiredService<Microsoft.AspNetCore.Http.IHttpContextAccessor>()
            );

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Onboarding}/{action=Index}/{id?}");
            });
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            var configurationDomainServiceEndpoint = Configuration.GetSection("DomainServiceEndPoints").Get<DomainServiceEndPointsConfig>();

            builder.RegisterModule(new AutofacModule(configurationDomainServiceEndpoint));
        }
    }
}

