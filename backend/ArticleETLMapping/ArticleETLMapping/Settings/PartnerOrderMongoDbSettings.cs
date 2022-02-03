using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class PartnerOrderMongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public int? ExecutionTimeoutMs { get; set; }
        public PartnerOrderMongoCollections MongoCollections { get; set; }
    }
}
