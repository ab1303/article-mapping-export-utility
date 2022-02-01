using ArticleETLMapping.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ArticleETLMapping.Repositories
{
    public abstract class BaseRepository<TEntity> where TEntity : class
    {
        private readonly IMongoCollection<TEntity> _dbCollection;

        protected BaseRepository(IMongoDbContext context, string collectionName)
        {
            var mongoContext = context ?? throw new ArgumentNullException(nameof(context));
            _dbCollection = !string.IsNullOrWhiteSpace(collectionName)
                ? mongoContext.GetCollection<TEntity>(collectionName)
                : throw new ArgumentNullException(nameof(collectionName));
        }

        protected virtual FilterDefinition<TEntity> GetFilterDefinition(Expression<Func<TEntity, bool>> filterExpression)
        {
            var filterBuilder = Builders<TEntity>.Filter;
            var filters = filterBuilder.Where(filterExpression);
            return filters;
        }

        public virtual FilterDefinition<TEntity> GetFilterDefinitionIn<TField>(Expression<Func<TEntity, TField>> filterExpression,
           List<TField> filterValues)
        {
            var filterBuilder = Builders<TEntity>.Filter;
            var filters = filterBuilder.In(filterExpression, filterValues);
            return filters;
        }

        protected virtual async Task<IAsyncCursor<TEntity>> FindAsync(FilterDefinition<TEntity> filterDefinition,
            FindOptions<TEntity, TEntity> findOptions = null)
        {
            if (findOptions != null)
            {
                return await _dbCollection.FindAsync(filterDefinition, findOptions);
            }

            return await _dbCollection.FindAsync(filterDefinition);
        }
    }
}
