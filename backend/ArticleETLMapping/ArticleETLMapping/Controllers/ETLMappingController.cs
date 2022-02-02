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
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public ETLMappingController(ILogger<ETLMappingController> logger, IMapper mapper, IMediator mediator, IFulfilmentStoreRepository fulfilmentStoreRepository)
        {
            _logger = logger;
            _fulfilmentStoreRepository = fulfilmentStoreRepository;
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(int))]
        public IActionResult UpoadChannelStoreArticles(ChannelStoreArticlesRequest request)
        {
            return Ok();
            //var storeResults = await _fulfilmentStoreRepository.GetStoresByState(State.ToString());
            //if (!storeResults.IsSuccess)
            //    return NotFound();


            //return Ok(_mapper.Map<IEnumerable<StoresByStateResponse>>(storeResults.Model));
        }

    }
}
