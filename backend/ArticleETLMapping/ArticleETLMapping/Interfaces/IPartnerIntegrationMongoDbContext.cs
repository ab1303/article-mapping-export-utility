using MongoDB.Driver;

namespace ArticleETLMapping.Interfaces
{
    public interface IPartnerIntegrationMongoDbContext: IMongoContext
    {
        public IMongoClient Client { get; }
    }
}
