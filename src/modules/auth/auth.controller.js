import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async(req, res) => {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "User Successfully created !", user);
}

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "User Verified Successfully!");
}

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    // Refresh token goes in httpOnly cookie — not accessible to JS
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Logged-in Successfully !", { user, accessToken });
}

export {register, login, verifyEmail};