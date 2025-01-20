import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerValidationUserSchema,
  loginValidationUserSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import * as authController from '../controllers/auth.js';
import { validateBody } from '../validation/validateBody.js';
import { requestResetEmailSchema } from '../validation/auth.js';

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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

// authRouter.get(
//   '/verify-email',
//   ctrlWrapper(authController.verifyEmailController),
// );

authRouter.get(
  '/reset-password',
  ctrlWrapper(authController.resetPasswordLinkController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

authRouter.post('/logout', ctrlWrapper(authController.logoutUserController));

export default authRouter;
