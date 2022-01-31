using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ArticleETLMapping.Extensions
{
    public static class AppExtensions
    {
        public static void UseSwaggerExtension(this IApplicationBuilder app, 
            IConfiguration configuration, IApiVersionDescriptionProvider provider)
        {
            string basePath = configuration["ApiBasePath"];
            app.UsePathBase($"/{basePath}");
            app.UseSwagger(ConfigureSwagger(basePath));

            app.UseSwaggerUI(
                options =>
                {
                    // build a swagger endpoint for each discovered API version
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        if (string.IsNullOrWhiteSpace(basePath))
                        {
                            options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",       description.GroupName.ToUpperInvariant());
                        }
                        else
                        {
                            options.SwaggerEndpoint($"/{basePath}/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
                        }
                    }
                    options.DisplayRequestDuration();
                }
            );
        }

     
        public static void UseEndpointsExtension(this IApplicationBuilder app)
        {
            var version = GetVersion();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/healthz", new HealthCheckOptions() { Predicate = (check) => !check.Tags.Contains("ready") });
                endpoints.MapHealthChecks("/ready", new HealthCheckOptions()
                {
                    Predicate = (check) => check.Tags.Contains("ready"),
                    ResponseWriter = WriteResponse
                });

                endpoints.MapGet("/version", async context =>
                {
                    await context.Response.WriteAsync(version);
                });
            });
        }

        private static Action<SwaggerOptions> ConfigureSwagger(string basePath)
        {
            return options =>
            {
                options.PreSerializeFilters.Add((swagger, httpRequest) =>
                {
                    if (httpRequest.PathBase.HasValue)
                    {
                        swagger.Servers = new List<OpenApiServer>
                        {
                            new OpenApiServer
                            {
                                Url = $"https://{httpRequest.Host.Value}{httpRequest.PathBase}"
                            }
                        };
                    }
                    else if (!string.IsNullOrWhiteSpace(basePath))
                    {
                        swagger.Servers = new List<OpenApiServer>
                        {
                            new OpenApiServer
                            {
                                Url = $"https://{httpRequest.Host.Value}/{basePath}"
                            }
                        };
                    }
                });
            };
        }

        private static Task WriteResponse(HttpContext context, HealthReport result)
        {
            context.Response.ContentType = "application/json";

            var json = new JObject(
                new JProperty("status", result.Status.ToString()),
                new JProperty("results", new JObject(result.Entries.Select(pair =>
                    new JProperty(pair.Key, new JObject(
                        new JProperty("status", pair.Value.Status.ToString()),
                        new JProperty("description", pair.Value.Description),
                        new JProperty("data", new JObject(pair.Value.Data.Select(
                            p => new JProperty(p.Key, p.Value))))))))));

            return context.Response.WriteAsync(
                json.ToString(Formatting.Indented));
        }

        private static string GetVersion()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
            return fileVersionInfo.FileVersion;
        }
    }
}
