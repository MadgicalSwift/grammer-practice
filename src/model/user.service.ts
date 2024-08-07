import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(
    mobileNumber: string,
    language: string,
    botID: string,
  ): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber, botID);
    if (existingUser) {
      existingUser.language = language;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.language = language;
      newUser.botID = botID;
      return this.userRepository.save(newUser);
    }
  }

  async findUserByMobileNumber(
    mobileNumber: string,
    botID: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { mobileNumber } });
  }

  async saveUser(user: User): Promise<User | undefined> {
    return this.userRepository.save(user);
  }

  // User Progress Functionalities
  async getUserProgress(mobileNumber: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { mobileNumber } });
  }
  // async getUserProgress(mobileNumber: string): Promise<User | undefined> {
  //   console.log('123');
  //   return this.userRepository.findOne({ where: { mobileNumber } });
  // }

  async saveUSerProgress(user: User): Promise<User | undefined> {
    return this.userRepository.save(user);
  }

  async resetUserProgress(mobileNumber: string): Promise<void> {
    let botId = process.env.botId;
    const user = await this.findUserByMobileNumber(mobileNumber, botId);
    if (user) {
      user.topic = null;
      user.difficulty = null;
      user.currentquesindex = 0;
      user.score = 0;
      await this.userRepository.save(user);
    }
  }

  // New Code
  // async getUserProgress(mobileNumber: string): Promise<User> {
  //   const user = await this.findUserByMobileNumber(mobileNumber);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return user;
  // }

  // async updateUserProgress(
  //   mobileNumber: string,
  //   topic: string,
  //   difficulty: string,
  //   currentquesindex: number,
  // ): Promise<User> {
  //   console.log('funcn called');
  //   const user = await this.findUserByMobileNumber(mobileNumber);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   user.topic = topic;
  //   user.difficulty = difficulty;
  //   user.currentquesindex = currentquesindex;
  //   return this.userRepository.save(user);
  // }
  async updateUserProgress(topic: string) {
    console.log('funcn called');
    // const user = await this.findUserByMobileNumber(mobileNumber);
    // if (!user) {
    //   throw new Error('User not found');
    // }
    // user.topic = topic;
    // user.difficulty = difficulty;
    // user.currentquesindex = currentquesindex;
    // return this.userRepository.save(user);
  }
}
