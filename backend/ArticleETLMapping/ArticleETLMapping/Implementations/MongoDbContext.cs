using ArticleETLMapping.Interfaces;
using System;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using ArticleETLMapping.Settings;

namespace ArticleETLMapping.Implementations
{
    public class MongoDbContext : IMongoDbContext
    {
        private IMongoDatabase Db { get; }

        public MongoDbContext(IOptions<MongoDbSettings> mongoSettings, IMongoClient mongoClient)
        {
            var mongoDbConfig = mongoSettings?.Value ?? throw new ArgumentNullException(nameof(mongoSettings));
            Db = mongoClient.GetDatabase(mongoDbConfig.DatabaseName);

            var pack = new ConventionPack
            {
                new CamelCaseElementNameConvention()
            };
            ConventionRegistry.Register("camelCase", pack, t => true);
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return Db.GetCollection<T>(name);
        }
    }
}
