using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class MongoCollections
    {
        public string FulfilmentStoreCollection { get; set; }
        public string StoreConfigurationCollection { get; set; }
    }
}
