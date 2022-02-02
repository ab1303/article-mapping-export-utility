using ArticleETLMapping.Models;
using System.Collections.Generic;

namespace ArticleETLMapping.Requests
{
    public class ChannelStoreArticle
    {
        public string Channel { get; set; }
        public int StoreId { get; set; }
        public int ArticleId { get; set; }
    }


    public class ChannelStoreArticlesRequest
    {
        public List<ChannelStoreArticle> StoreArticles { get; set; }
    }
}
