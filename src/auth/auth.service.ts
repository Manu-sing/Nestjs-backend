import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserDetails } from 'src/user/interfaces/user.interface';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<CreateUserDTO>): Promise<UserDetails | any> {
    const { name, email, password } = user;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) return 'Email taken!';
    // if the user doesn't already exist
    const hashedPassword = await this.hashPassword(password);
    // create a new user with the help of the user service
    const newUser = await this.userService.createUser(
      name,
      email,
      hashedPassword,
    );
    // return a user that doesn't contain the password and has the id
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // to check if, when the user logs in, the password used matches with the hashed password stored in the db
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesTheUserExist = !!user; // meaning that it exists, not not null
    if (!doesTheUserExist) return null;
    // now let's check if the password match
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async login(
    existintUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { email, password } = existintUser;
    const user = await this.validateUser(email, password);
    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
