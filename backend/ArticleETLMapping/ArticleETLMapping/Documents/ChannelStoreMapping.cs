using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ArticleETLMapping.Documents
{
    [BsonIgnoreExtraElements]
    public class ChannelStoreMapping : Document<ObjectId>
    {
        public string Channel { get; set; }
        public int StoreId { get; set; }
        public int ArticleId { get; set; }
    }
}
