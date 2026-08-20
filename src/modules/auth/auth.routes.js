import { Router } from "express";
import * as controller from './auth.controller.js';
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import { authenticate } from "./auth.middleware.js";

const router = new Router();

router.post('/register', validate(RegisterDto), controller.register);
router.get("/verify-email/:token", controller.verifyEmail);
router.post('/login', validate(LoginDto), controller.login);
router.get('/refresh-token', controller.refreshToken);
router.get('/profile', authenticate, controller.profile);


export default router;