using ArticleETLMapping.Documents;
using ArticleETLMapping.Interfaces;
using ArticleETLMapping.Models;
using ArticleETLMapping.Results;
using ArticleETLMapping.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArticleETLMapping.Repositories
{

    public class FulfilmentStoreRepository : BaseRepository<IPartnerOrderMongoDbContext, FulfilmentStore>, IFulfilmentStoreRepository
    {
        private readonly ILogger<FulfilmentStoreRepository> _logger;
        private readonly IOptions<EnabledStoreSettings> _enabledStoreSettings;
        private readonly IMongoCollection<FulfilmentStore> _collection;

        public FulfilmentStoreRepository(
            ILogger<FulfilmentStoreRepository> logger,
            IPartnerOrderMongoDbContext context,
            IOptions<PartnerOrderMongoDbSettings> mongoDbSettings,
            IOptions<EnabledStoreSettings> enabledStoreSettings
        ) : base(context, mongoDbSettings?.Value?.MongoCollections?.FulfilmentStoreCollection)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _enabledStoreSettings = enabledStoreSettings;
            _collection = context.GetCollection<FulfilmentStore>(mongoDbSettings?.Value?.MongoCollections?.FulfilmentStoreCollection);
        }

        public async Task<Result<IEnumerable<FulfilmentStore>>> GetStoresByState(string state)
        {
            var logProperties = new
            {
                State = state
            };

            try
            {
                var storeIdsByState = state switch
                {
                    "NSW" => _enabledStoreSettings.Value.NSW,
                    "VIC" => _enabledStoreSettings.Value.VIC,
                    "QLD" => _enabledStoreSettings.Value.QLD,
                    _ => throw new NotImplementedException()
                };

                var storeIdsByStateArray = storeIdsByState.Split(',').Select(x => Convert.ToInt32(x.Trim())).ToList();

                var filterDefinition = GetFilterDefinitionIn(x => x.Id, storeIdsByStateArray);

                var result = await FindAsync(filterDefinition);

                var documents = result?.ToList();

                if (documents == null)
                {
                    _logger.LogInformation("Could not find matching store details from database {@LogProperties}", logProperties);
                    return Result<IEnumerable<FulfilmentStore>>.Ok(null);
                }

                _logger.LogInformation("Successfully found store details from database {@LogProperties}", logProperties);
                return Result<IEnumerable<FulfilmentStore>>.Ok(documents);
            }
            catch
            {
                _logger.LogError("An unexpected error occurred while retrieving store details {@LogProperties}.",
                    logProperties);
                return Result<IEnumerable<FulfilmentStore>>.Fail(new Error
                {
                });
            }
        }

       
    }
}
