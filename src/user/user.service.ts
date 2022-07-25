import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDetails } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  _getUserDetails(user: User): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }
    return this._getUserDetails(user);
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const newUser = await new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
}
