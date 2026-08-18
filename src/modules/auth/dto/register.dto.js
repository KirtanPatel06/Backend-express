import BaseDto from "../../../common/dto/base.dto.js";
import Joi from 'joi';

class RegisterDto extends BaseDto{
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().trim().email().lowercase().required(),
        password: Joi.string().trim().min(8).message("Password should be of min 8 chars").required(),
        role: Joi.string().valid("user", "admin").default("user")
    });
}

export default RegisterDto;