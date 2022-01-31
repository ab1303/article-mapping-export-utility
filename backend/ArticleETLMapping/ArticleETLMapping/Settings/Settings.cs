using System.Diagnostics.CodeAnalysis;

namespace ArticleETLMapping.Settings
{
    [ExcludeFromCodeCoverage]
    public class Settings
    {
        public MongoDbSettings MongoDbConfig { get; set; }

    }
}
