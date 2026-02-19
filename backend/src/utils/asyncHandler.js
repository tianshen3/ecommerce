//this asynchHandler is used to catch errors in the case of async fucntions being passed as requestHandler 
//the asyncfunction is wrapped in the asyncHandler and contains three parameters req, res and next, orginally requestHandler had only two parameters req and res
//next is a function , which catches error because async errors are rejected promises which express cannot catch
//therefore this asyncHandler converts the async errors into next(error)
//as if the promise is rejected catch sends to error to the next fucntion
//next(error)pushes the error to express global error handler
//the wrapped requestHandler becomes a sort of express middleware since it matches its syntax of req, res , next
const asyncHandler = (requestHandler) => {
    return (req, res, next) =>{
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((error) => next(error));
    }
};

export {asyncHandler};