import { AppDataSource } from '../config/data-source.js';
import { UserPassportEntity } from '../types/entitys/user-passport.entity.js';


export class UserPassportDao {
  private userPassportRepository = AppDataSource.getRepository(UserPassportEntity);

  async findByProviderAndProviderUserId(provider: string, providerUserId: string): Promise<UserPassportEntity | null> {
    return this.userPassportRepository.findOne({
      where: {
        provider,
        providerUserId,
      },
      relations: {
        user: true,
      },
    });
  }

  async createUserPassport(userId: string, provider: string, providerUserId: string) {
    const newUserPassport = this.userPassportRepository.create({
      userId,
      provider,
      providerUserId,
    });
    return this.userPassportRepository.save(newUserPassport);
  }
}