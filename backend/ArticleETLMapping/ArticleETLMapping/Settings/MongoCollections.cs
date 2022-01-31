using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class MongoCollections
    {
        public string OrderCollection { get; set; }
        public string StoreConfigurationCollection { get; set; }
    }
}
