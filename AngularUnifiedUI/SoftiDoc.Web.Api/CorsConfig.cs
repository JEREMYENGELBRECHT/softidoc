using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin;
using Owin;

namespace SoftiDoc.Web.Api
{
    public class CorsConfig
    {
        public static void Configure(IAppBuilder app)
        {
            app.Use(async (context, next) =>
            {
                await Cors(context, next);
            });
        }

        private static async Task Cors(IOwinContext context, Func<Task> next)
        {
            IOwinRequest req = context.Request;
            IOwinResponse res = context.Response;
            // for auth2 token requests, and web api requests
            if (req.Path.StartsWithSegments(new PathString("/api")))
            {
                // if there is an origin header
                var origin = req.Headers.Get("Origin");
                if (!string.IsNullOrEmpty(origin))
                {
                    // allow the cross-site request
                    res.Headers.Set("Access-Control-Allow-Origin", origin);
                }
                else
                {
                    res.Headers.Set("Access-Control-Allow-Origin", "*");
                }

                res.Headers.Append("Access-Control-Allow-Credentials", "true");
                res.Headers.AppendCommaSeparatedValues("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
                res.Headers.AppendCommaSeparatedValues("Access-Control-Allow-Headers", "Authorization", "Content-Type", "Accept");
                res.Headers.Append("Access-Control-Max-Age", "3600");

                // if this is pre-flight request
                if (req.Method == "OPTIONS")
                {
                    res.StatusCode = 200;
                    return;
                }
            }
            // continue executing pipeline
            await next();
        }
    }
}