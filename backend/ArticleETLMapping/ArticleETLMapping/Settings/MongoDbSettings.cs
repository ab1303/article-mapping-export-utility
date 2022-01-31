using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public int? ExecutionTimeoutMs { get; set; }
        public MongoCollections MongoCollections { get; set; }
    }
}
