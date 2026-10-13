
import { type Request, type Response, Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config.json' with { type: 'json' };

import { AuthService } from '../services/auth.service.js';
import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';

const googleClient = new OAuth2Client(
  config.googleClientId,
);

export class AuthController {
  private authService = new AuthService();

  async googleLogin(req: Request, res: Response) {
    const { credential } = req.body;

    console.log('credential => ', credential);

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return ResponseUtils.sendResponse(res, {
        message: 'Invalid Google credential',
        code: ErrorCode.AUTHENTICATION_REQUIRED,
        httpStatus: HttpCode.UNAUTHORIZED,
        data: null,
      });
    }

    console.log('Google user:', {
      email: payload.email,
      name: payload.name,
      email_verified: payload.email_verified,
    });

    if (!payload.email_verified) {
      return ResponseUtils.sendResponse(res, {
        message: 'Unverified Google credential',
        code: ErrorCode.AUTHENTICATION_REQUIRED,
        httpStatus: HttpCode.UNAUTHORIZED,
        data: null,
      });
    }

    if (!payload.email) {
      return ResponseUtils.sendResponse(res, {
        message: 'Missing Google email',
        code: ErrorCode.AUTHENTICATION_REQUIRED,
        httpStatus: HttpCode.UNAUTHORIZED,
        data: null,
      });
    }

    const userInfo = await this.authService.loginOrRegister(payload);

    console.log('userInfo => ', userInfo);

    return ResponseUtils.sendResponse(res, {
      message: 'Google login successful',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data: userInfo,
    });
  }
}


const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/google', authController.googleLogin.bind(authController));

export default AuthRouter;