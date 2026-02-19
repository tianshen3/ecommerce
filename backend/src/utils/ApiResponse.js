//a class to decide the response format 
class ApiResponse {
    //whenever ApiResponse type's object is created , it will have the following  key value pairs
    constructor(statusCode, data, message ="Success")
    {
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode<400
    }
}

export default ApiResponse;