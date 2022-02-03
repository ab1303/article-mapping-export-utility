using ArticleETLMapping.Documents;
using ArticleETLMapping.Models;
using ArticleETLMapping.Results;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArticleETLMapping.Interfaces
{
    public interface IChannelStoreMappingRepository
    {
        Task<Result> UpsertChannelStoreMappingAsync(int storeId, List<ChannelStoreMapping> channelStoreMappings);
    }
}
