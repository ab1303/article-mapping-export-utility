using ArticleETLMapping.Interfaces;
using System;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using ArticleETLMapping.Settings;

namespace ArticleETLMapping.Implementations
{
    public class PartnerIntegrationMongoDbContext : IPartnerIntegrationMongoDbContext
    {
        private IMongoDatabase Db { get; }
        public IMongoClient Client { get; }

        public PartnerIntegrationMongoDbContext(IOptions<PartnerIntegrationMongoDbSettings> mongoSettings)
        {
            var mongoDbConfig = mongoSettings?.Value ?? throw new ArgumentNullException(nameof(mongoSettings));
            Client = new MongoClient(mongoDbConfig.ConnectionString);
            Db = Client.GetDatabase(mongoDbConfig.DatabaseName);

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
