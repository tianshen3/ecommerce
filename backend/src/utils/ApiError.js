class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack =  ""
    ){
        //this calls the constructor of the Error Class of JS for the class ApiERRor
        //which has name, message and stack
        super(message)
        //now for the rest options
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        //this is if stack is give use it otherwise
        if(stack){
            this.stack = stack
        }
        else{
            //create stacktrace by removing apierror constructor from stack 
            //which allows stack to point to real location
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError;