using MongoDB.Bson.Serialization.Attributes;

namespace ArticleETLMapping.Documents
{
    public class Document<TKey>
    {
        [BsonId]
        public TKey Id { get; set; }
    }
}
