using ArticleETLMapping.Documents;
using ArticleETLMapping.Interfaces;
using ArticleETLMapping.Results;
using ArticleETLMapping.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace ArticleETLMapping.Repositories
{

    public class ChannelStoreMappingRepository : BaseRepository<IPartnerIntegrationMongoDbContext, ChannelStoreMapping>, IChannelStoreMappingRepository
    {
        private readonly ILogger<ChannelStoreMappingRepository> _logger;
        private readonly IClientSessionHandle _session;
        private readonly IMongoCollection<ChannelStoreMapping> _collection;

        public ChannelStoreMappingRepository(
            ILogger<ChannelStoreMappingRepository> logger,
            IPartnerIntegrationMongoDbContext context,
            IClientSessionHandle session,
            IOptions<PartnerIntegrationMongoDbSettings> mongoDbSettings
        ) : base(context, mongoDbSettings?.Value?.MongoCollections?.ChannelStoreMappingCollection)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _session = session;
            _collection = context.GetCollection<ChannelStoreMapping>(mongoDbSettings?.Value?.MongoCollections?.ChannelStoreMappingCollection);
        }

      
        public async Task<Result> UpsertChannelStoreMappingAsync(int storeId, List<ChannelStoreMapping> channelStoreMappings)
        {
            try
            {
                // Now need a mongo client session

                // Delete All documents for that (channel, store)

                var filter = GetFilterDefinition("UE", storeId);

                var result = await _collection.DeleteManyAsync(filter);

                // Insert all for that store (channel, store)

                var insertionResult = await BulkInsertAsync(storeId, channelStoreMappings);

                return insertionResult;

            }
            catch (Exception e)
            {
                return Result.Fail(new Error { Message = e.Message });
            }
        }

        private async Task<Result> BulkInsertAsync(int storeId, IEnumerable<ChannelStoreMapping> documents)
        {
            {
                if (documents == null || !documents.Any())
                {
                    return Result.Ok;
                }
                try
                {
                    // Batch documents in limit of 10
                    // Wait for all to be completed
                    var batchSize = 10;
                    var maxDegreeOfParallelism = 3;
                    var batchDocuments = SetupBatchBlock(batchSize);
                    var insertDocuments = SetupActionBlock(maxDegreeOfParallelism);

                    batchDocuments.LinkTo(insertDocuments);

                    foreach (var outboxDocument in documents)
                    {
                        batchDocuments.Post(outboxDocument);
                    }

                    batchDocuments.Complete();

                    await batchDocuments.Completion.ContinueWith(delegate { insertDocuments.Complete(); });

                    await insertDocuments.Completion;

                    return Result.Ok;
                }
                catch
                {
                    var logProperties = new
                    {
                        storeId = storeId,
                        ChannelStoreMappingCount = documents.Count(),
                    };
                    _logger.LogError("An unexpected error occured while inserting product location outbox documents {@LogProperties}.", logProperties);
                    throw;
                }
            }
        }

        private ActionBlock<IEnumerable<ChannelStoreMapping>> SetupActionBlock(int maxDegreeOfParallelism) =>
                   new ActionBlock<IEnumerable<ChannelStoreMapping>>(async documents =>
                                   await InsertOutboxDocumentsAsync(documents),
                                   new ExecutionDataflowBlockOptions
                                   {
                                       MaxDegreeOfParallelism = maxDegreeOfParallelism
                                   }
                               );

        private BatchBlock<ChannelStoreMapping> SetupBatchBlock(int batchSize) =>
                    new BatchBlock<ChannelStoreMapping>(batchSize);


        private async Task InsertOutboxDocumentsAsync(IEnumerable<ChannelStoreMapping> documents)
        {
            await _collection.InsertManyAsync(_session, documents);
        }

        private static FilterDefinition<ChannelStoreMapping> GetFilterDefinition(string channel, int storeId)
        {
            var filterBuilder = Builders<ChannelStoreMapping>.Filter;
            var filters = filterBuilder.Eq(x => x.Channel, channel) &
                filterBuilder.Eq(x => x.StoreId, storeId);

            return filters;
        }
    }
}
