import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as authValidate from '../validation/auth.js';
import * as authController from '../controllers/auth.js';
import { validateBody } from '../validation/validateBody.js';
import { requestResetEmailSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authValidate.registerValidationUserSchema),
  ctrlWrapper(authController.registerUserController),
);

authRouter.post(
  '/login',
  validateBody(authValidate.loginValidationUserSchema),
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
  validateBody(authValidate.resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

authRouter.post('/logout', ctrlWrapper(authController.logoutUserController));

authRouter.get(
  '/get-google-oauth-url',
  ctrlWrapper(authController.getGoogleOAuthUrlController),
);

authRouter.post(
  '/confirm-oauth',
  validateBody(authValidate.loginWithGoogleOAuthSchema),
  ctrlWrapper(authController.loginWithGoogleController),
);

export default authRouter;
