import { type Request, type Response, Router } from 'express';


export class AuthController {
  async googleLogin(req: Request, res: Response) {
    const { credential } = req.body;

    console.log('credential => ', credential);

    res.json({
      message: 'Google login endpoint',
    });
  }
}


const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/google', authController.googleLogin.bind(authController));

export default AuthRouter;