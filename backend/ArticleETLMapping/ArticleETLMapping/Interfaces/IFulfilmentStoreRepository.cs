using ArticleETLMapping.Documents;
using ArticleETLMapping.Models;
using ArticleETLMapping.Results;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArticleETLMapping.Interfaces
{
    public interface IFulfilmentStoreRepository
    {
        Task<Result<IEnumerable<FulfilmentStore>>> GetStoresByState(string state);
    }
}
