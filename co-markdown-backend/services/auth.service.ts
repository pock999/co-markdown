import { type TokenPayload } from 'google-auth-library';
import { UserPassportDao } from '../daos/user-passport.dao.js';
import { UserDao } from '../daos/user.dao.js';
import { UserEntity } from '../types/entitys/user.entity.js';
import config from '../config/config.json' with { type: 'json' };

import jwt, { type SignOptions } from 'jsonwebtoken';

export class AuthService {
  private userPassportDao = new UserPassportDao();
  private userDao = new UserDao();

  async loginOrRegister(payload: TokenPayload) {
    console.log('Service:', {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });

    const userPassport = await this.userPassportDao.findByProviderAndProviderUserId(
      'google', payload.sub!,
    );

    console.log('userPassport => ', userPassport);

    let user: UserEntity | null;

    if (userPassport) {
      // 取得 User
      console.log('exist passport => ', userPassport);

      if (!userPassport.user) {
        // TODO:
        throw new Error('UserPassport references a missing User');
      }

      user = userPassport.user;
      console.log('passport exist user => ', user);
    } else {
      const existUser = await this.userDao.findByEmail(payload.email!);

      console.log('existUser => ', existUser);
      if (!existUser) {
        // Create User
        user = await this.userDao.createUser(payload.email!, payload.name!, payload.picture ?? null);
        console.log('create user => ', user);
      } else {
        user = existUser;
      }

      // Create UserPassport
      await this.userPassportDao.createUserPassport(user.id, 'google', payload.sub!);
      console.log('create passport');
    }

    const options: SignOptions = {
      subject: user.id,
      expiresIn: config.jwt.expiresIn,
      issuer: config.jwt.issuer,
    };
    const jwtToken = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      config.jwt.secret,
      options,
    );

    return {
      jwtToken,
      email: user.email,
      name: user.name,
    };
  }
}
