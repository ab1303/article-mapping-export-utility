using ArticleETLMapping.Documents;
using ArticleETLMapping.Responses;
using AutoMapper;

namespace ArticleETLMapping.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<FulfilmentStore, StoresByStateResponse>()
                .ForMember(d => d.StoreId, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.StoreName, opt => opt.MapFrom(s => s.Name))
                .ForMember(d => d.Street, opt => opt.MapFrom(s => s.Street1))
                .ForMember(d => d.Suburb, opt => opt.MapFrom(s => s.Suburb))
                ;
        }
    }
    }
