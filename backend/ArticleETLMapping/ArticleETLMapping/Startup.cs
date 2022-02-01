using ArticleETLMapping.Extensions;
using ArticleETLMapping.Implementations;
using ArticleETLMapping.Interfaces;
using ArticleETLMapping.Repositories;
using ArticleETLMapping.Settings;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.ApplicationInsights.DependencyInjection;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace ArticleETLMapping
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
            services.AddSwaggerExtension();
            services.AddApiVersioningExtension();

            services.AddAutoMapper(typeof(Startup).Assembly);
            services.AddMediatR(typeof(Startup).Assembly);

            // App Settings
            services.Configure<MongoDbSettings>(Configuration.GetSection("Settings:MongoDbSettings"));
            services.Configure<EnabledStoreSettings>(Configuration.GetSection("Settings:EnabledStoreSettings"));


            // TODO: Add Services if any

            // Mongo
            var mongoDbConnString = Configuration["Settings:MongoDbSettings:ConnectionString"];
            services.AddMongoClient(mongoDbConnString);
            services.AddSingleton<IMongoDbContext, MongoDbContext>();

            // Repo
            services.AddTransient<IFulfilmentStoreRepository, FulfilmentStoreRepository>();

            services.AddControllers()
                .AddJsonOptions(options =>
                        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
            ;
           
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins(
                            "http://localhost:3000",
                            "http://localhost:7000")
                         .AllowAnyHeader()
                         .AllowAnyMethod();
                    });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ArticleETLMapping v1"));
            }

            app.UseRouting();
            app.UseCors();
            app.UseSwaggerExtension(Configuration, provider);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
