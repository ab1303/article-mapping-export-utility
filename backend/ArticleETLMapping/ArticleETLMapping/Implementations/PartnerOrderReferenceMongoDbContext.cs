using ArticleETLMapping.Interfaces;
using System;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using ArticleETLMapping.Settings;

namespace ArticleETLMapping.Implementations
{
    public class PartnerOrderReferenceMongoDbContext : IPartnerOrderReferenceMongoDbContext
    {
        private IMongoDatabase Db { get; }

        public PartnerOrderReferenceMongoDbContext(IOptions<PartnerOrderMongoDbSettings> mongoSettings)
        {
            var mongoDbConfig = mongoSettings?.Value ?? throw new ArgumentNullException(nameof(mongoSettings));
            var mongoClient = new MongoClient(mongoDbConfig.ConnectionString);
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
