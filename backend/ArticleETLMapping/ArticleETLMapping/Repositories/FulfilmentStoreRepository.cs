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

    public class FulfilmentStoreRepository : BaseRepository<IPartnerOrderReferenceMongoDbContext, FulfilmentStore>, IFulfilmentStoreRepository
    {
        private readonly ILogger<FulfilmentStoreRepository> _logger;
        private readonly IOptions<EnabledStoreSettings> _enabledStoreSettings;
        private readonly IMongoCollection<FulfilmentStore> _collection;

        public FulfilmentStoreRepository(
            ILogger<FulfilmentStoreRepository> logger,
            IPartnerOrderReferenceMongoDbContext context,
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
                    "NSW_SUPER" => _enabledStoreSettings.Value.NSW_SUPER,
                    "NSW_METRO" => _enabledStoreSettings.Value.NSW_METRO,
                    "VIC_SUPER" => _enabledStoreSettings.Value.VIC_SUPER,
                    "VIC_METRO" => _enabledStoreSettings.Value.VIC_METRO,
                    "QLD_SUPER" => _enabledStoreSettings.Value.QLD_SUPER,
                    "QLD_METRO" => _enabledStoreSettings.Value.QLD_METRO,
                    _ => throw new NotImplementedException()
                };

                if(storeIdsByState == null || storeIdsByState.Length ==0) 
                    return Result<IEnumerable<FulfilmentStore>>.Ok(new List<FulfilmentStore>());

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
