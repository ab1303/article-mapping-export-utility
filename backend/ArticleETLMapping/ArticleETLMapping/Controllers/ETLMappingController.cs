using ArticleETLMapping.Documents;
using ArticleETLMapping.Interfaces;
using ArticleETLMapping.Models;
using ArticleETLMapping.Requests;
using ArticleETLMapping.Responses;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArticleETLMapping.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ETLMappingController : ControllerBase
    {
        private readonly ILogger<ETLMappingController> _logger;
        private readonly IFulfilmentStoreRepository _fulfilmentStoreRepository;
        private readonly IChannelStoreMappingRepository _channelStoreMappingRepository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public ETLMappingController(ILogger<ETLMappingController> logger,
            IMapper mapper,
            IMediator mediator,
            IFulfilmentStoreRepository fulfilmentStoreRepository,
            IChannelStoreMappingRepository channelStoreMappingRepository
            )
        {
            _logger = logger;
            _fulfilmentStoreRepository = fulfilmentStoreRepository;
            _channelStoreMappingRepository = channelStoreMappingRepository;
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetStoresByState(StateEnum State)
        {

            var storeResults = await _fulfilmentStoreRepository.GetStoresByState(State.ToString());
            if (!storeResults.IsSuccess)
                return NotFound();


            return Ok(_mapper.Map<IEnumerable<StoresByStateResponse>>(storeResults.Model));
        }


        [HttpPost]
        [Route("storeArticles/upload")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ChannelStoreArticlesResponse))]
        public async Task<IActionResult> UpoadChannelStoreArticles(ChannelStoreArticlesRequest request)
        {

            if (request.StoreArticles.Count == 0)
            {
                return BadRequest(new { Message = "Store articles not found for that store" });
            }

            var storeResults = await _channelStoreMappingRepository.UpsertChannelStoreMappingAsync(
                request.StoreId,
                _mapper.Map<List<ChannelStoreMapping>>(request.StoreArticles)
                );

            if (!storeResults.IsSuccess)
                return StatusCode(StatusCodes.Status500InternalServerError, storeResults.Error.Message);

            return Ok(new ChannelStoreArticlesResponse { Message = "Records updated successfully" });

        }

    }
}
