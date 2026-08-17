import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async(req, res) => {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "User Successfully created !", user);
}

const login = async() => {

}

export {register, login};