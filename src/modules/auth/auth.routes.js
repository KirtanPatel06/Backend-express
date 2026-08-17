import { Router } from "express";
import * as controller from './auth.controller.js';

const router = new Router();

router.post('/register', controller.register);


export default router;