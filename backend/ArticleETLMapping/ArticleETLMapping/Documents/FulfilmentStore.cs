using MongoDB.Bson.Serialization.Attributes;
using System;

namespace ArticleETLMapping.Documents
{
    [BsonIgnoreExtraElements]
    public class FulfilmentStore : Document<int>
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Street1 { get; set; }
        public string Street2 { get; set; }
        public string Area { get; set; }
        public string PostCode { get; set; }
        public string Suburb { get; set; }
        public string State { get; set; }
        public string PhoneNumber { get; set; }
        public string DriveUpDirections { get; set; }
        public string Timezone { get; set; }
        public object[] TradingHours { get; set; }
        public string DriveUpMapImageUrl { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime UpdatedDateTimeUtc { get; set; }
    }
}
