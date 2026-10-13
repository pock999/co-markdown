/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Request, type Response, Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config.json' with { type: 'json' };

import { AuthService } from '../services/auth.service.js';
import { type BaseResponse } from '../response/base-response.js';
import { HttpCode } from '../../shared/http-code.constant.js';
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
      res.status(401).json({ message: 'Invalid Google credential' });
      return;
    }

    console.log('Google user:', {
      email: payload.email,
      name: payload.name,
      email_verified: payload.email_verified,
    });

    if (!payload.email_verified) {
      res.status(401).json({ message: 'Unverified Google credential' });
      return;
    }

    if (!payload.email) {
      res.status(401).json({ message: 'Missing Google email' });
      return;
    }

    const userInfo = await this.authService.loginOrRegister(payload);

    console.log('userInfo => ', userInfo);

    const responsePayload: BaseResponse<any> = {
      message: 'Google login successful',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data: userInfo,
    };

    return ResponseUtils.sendResponse(res, responsePayload);
  }
}


const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/google', authController.googleLogin.bind(authController));

export default AuthRouter;