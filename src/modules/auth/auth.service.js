import ApiError from '../../common/utils/api-error.js';
import User from './auth.model.js';
import * as tokens from '../../common/utils/jwt-utils.js';
import * as mail from '../../common/config/email.js';
import crypto from 'crypto';

const hashToken = async(token) => {
    return crypto.createHash("sha256").update(token).digest('hex');
}

const register = async({name, email, password, role}) => {
    const existingUser = await User.findOne({email});
    if(existingUser)
        throw ApiError.conflict("User with this email already exists!");

    const {rawToken, hashedToken} = tokens.generateVerificationToken();

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    });

    try{
        await mail.sendVerificationEmail(email, rawToken);
    }
    catch(err){
        console.log(err);
    }
        
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;


    return userObj;
}

const verifyEmail = async(token) => {
    const trimmed = String(token).trim();
    if (!trimmed)
        throw ApiError.badRequest("Invalid or expired verification token");
    

    // DB stores SHA256(raw). Links / email use the raw token — we hash for lookup.
    // If you paste the hash from MongoDB into Postman, hashing again would not match;
    // so we also try a direct match on the stored value.
    const hashedInput = await hashToken(trimmed);
    let user = await User.findOne({ verificationToken: hashedInput }).select("+verificationToken");
    if (!user)
        user = await User.findOne({ verificationToken: trimmed }).select("+verificationToken");

    if (!user) 
        throw ApiError.badRequest("Invalid or expired verification token");

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 },
    });

    return user;
}

const login = async ({ email, password }) => {

    // Find user from it's email in DB
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        throw ApiError.unAuthorized("Invalid Email or Password !");

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if(!isMatch)
        throw ApiError.unAuthorized("Invalid email or password !");

    if (!user.isVerified)
        throw ApiError.forbidden("Please verify your E-mail before Log-in.");

    const accessToken = tokens.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = tokens.generateRefreshToken({ id: user._id });

    // store Hashed refreshToken in DB after hashing it
    user.refreshToken = hashToken(refreshToken);
    await user.save({validateBeforeSave: false});

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return {user: userObj, accessToken, refreshToken};
}

export {register, login, verifyEmail};