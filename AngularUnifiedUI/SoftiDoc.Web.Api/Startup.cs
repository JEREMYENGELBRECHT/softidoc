using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using log4net;
using log4net.Appender;
using log4net.Core;
using log4net.Layout;
using log4net.Repository.Hierarchy;
using Microsoft.Owin;
using Microsoft.Owin.Security.DataHandler;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using Owin;

[assembly: OwinStartup(typeof(SoftiDoc.Web.Api.Startup))]

namespace SoftiDoc.Web.Api
{
    public static class RouteNames
    {
        public static string DefaultApi = "defaultApi";
    }
    
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            ConfigureHttp(config);
            ConfigurePipeline(app, config);
            
        }

        private static void ConfigurePipeline(IAppBuilder app, HttpConfiguration config)
        {
            CorsConfig.Configure(app);

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
            {
                AccessTokenFormat = new TicketDataFormat(new ClearText())
            });

            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            app.UseWebApi(config);
        }

        private static void ConfigureHttp(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: RouteNames.DefaultApi,
                routeTemplate: "api/{controller}/{id}",
                defaults: new
                {
                    id = RouteParameter.Optional
                });

            config.Formatters.Remove(config.Formatters.XmlFormatter);
        }


    }

    public class ClearText : IDataProtector
    {
        public byte[] Protect(byte[] userData)
        {
            throw new NotImplementedException();
        }

        public byte[] Unprotect(byte[] protectedData)
        {
            throw new NotImplementedException();
        }
    }

}


