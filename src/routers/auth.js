import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerValidationUserSchema,
  loginValidationUserSchema,
} from '../validation/auth.js';
import * as authController from '../controllers/auth.js';
import { validateBody } from '../validation/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerValidationUserSchema),
  ctrlWrapper(authController.registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginValidationUserSchema),
  ctrlWrapper(authController.loginUserController),
);

authRouter.post(
  '/refresh',
  ctrlWrapper(authController.refreshUserSessionController),
);

authRouter.post('/logout', ctrlWrapper(authController.logoutUserController));

export default authRouter;
