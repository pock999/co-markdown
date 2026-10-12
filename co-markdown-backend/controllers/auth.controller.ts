import { type Request, type Response, Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config.json' with { type: 'json' };

const googleClient = new OAuth2Client(
  config.googleClientId,
);

export class AuthController {
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
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });

    res.json({
      message: 'Google login endpoint',
    });
  }
}


const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/google', authController.googleLogin.bind(authController));

export default AuthRouter;