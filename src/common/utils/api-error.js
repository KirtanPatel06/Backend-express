class ApiError extends Error{
    constructor(statusCode, msg){
        super(msg);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = "Bad Request"){
        return new ApiError(400, message);
    }
    
    static unAuthorized(message = "Unauthorized"){
        return new ApiError(401, message);
    }

    static conflict(message = "User already Exists !"){
        return new ApiError(409, message);
    }

    static forbidden(message = "forbidden !"){
        return new ApiError(412, message);
    }

    static notFound(message = "User not Found !"){
        return new ApiError(412, message);
    }
}

export default ApiError;