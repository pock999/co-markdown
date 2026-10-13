import { AppDataSource } from '../config/data-source.js';
import { UserEntity } from '../types/entitys/user.entity.js';



export class UserDao {
  private userRepository = AppDataSource.getRepository(UserEntity);

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(email: string, name: string, avatar: string | null) {
    const newUser = this.userRepository.create({
      email,
      name,
      avatar,
    });
    return this.userRepository.save(newUser);
  }
}