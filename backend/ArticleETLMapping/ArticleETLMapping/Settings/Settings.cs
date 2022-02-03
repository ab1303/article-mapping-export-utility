using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class Settings
    {
        public PartnerOrderMongoDbSettings MongoDbConfig { get; set; }
        public EnabledStoreSettings EnabledStores { get; set; }

    }
}
