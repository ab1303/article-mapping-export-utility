using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArticleETLMapping.Results
{
    public enum ResultStatus
    {
        Success = 0,
        Failure = 1
    }

    public class Error
    {
        public string Message { get; set; }
    }

    public class AbstractResult
    {
        public Error Error { get; set; }

        public ResultStatus Status { get; set; }

        public bool IsSuccess => Status == ResultStatus.Success;
    }

    public class Result : AbstractResult
    {
        private Result() { }

        public static Result Fail(Error error)
        {
            return new Result
            {
                Status = ResultStatus.Failure,
                Error = new Error
                {
                    Message = error.Message
                }
            };
        }
        public static Result Ok => new()
        {
            Status = ResultStatus.Success
        };
    }

    public class Result<T> : AbstractResult
    {
        private Result()
        {

        }
        public T Model { get; set; }

        public static Result<T> Fail(Error error)
        {
            return new Result<T>
            {
                Status = ResultStatus.Failure,
                Error = new Error
                {
                    Message = error.Message
                }
            };
        }

        public static Result<T> Ok(T model)
        {
            return new Result<T>
            {
                Model = model,
                Status = ResultStatus.Success
            };
        }
    }
}
