import ApiError from "../../common/utils/api-error.js";
import * as tokens from '../../common/utils/jwt-utils.js';
import User from './auth.model.js';
import 'dotenv/config';

// Authenticates using the short-lived access token (header or cookie)
const authenticate = async (req, res, next) => {

    let token;

    if(req.headers.authorization?.startsWith('Bearer'))
        token = req.headers.authorization.split(" ")[1];

    if(!token)
        throw ApiError.unAuthorized("You are not Logged-in");

    const decoded = tokens.verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if(!user)
        throw ApiError.unAuthorized("User no longer exists !");

    req.user = {
        id: user._id,
        role: user.role
    }

    // Don't forget to write next() in middlewares.
    next();
}

// Higher-order function — returns middleware configured with allowed roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            throw ApiError.forbidden("You do not have permission to perform this Action.");

        // Don't forget to write next() in middlewares.
        next();
    }
}

export { authenticate, authorize };