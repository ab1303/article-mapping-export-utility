using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class PartnerIntegrationMongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public int? ExecutionTimeoutMs { get; set; }
        public PartnerIntegrationMongoCollections MongoCollections { get; set; }
    }
}
