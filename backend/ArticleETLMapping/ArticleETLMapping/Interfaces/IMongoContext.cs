using MongoDB.Driver;

namespace ArticleETLMapping.Interfaces
{
    public interface IMongoContext
    {
        IMongoCollection<T> GetCollection<T>(string name);
    }
}
