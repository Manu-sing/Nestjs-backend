import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserDetails } from 'src/user/interfaces/user.interface';
import { AuthService } from './auth.service';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDTO): Promise<UserDetails | any> {
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    return this.authService.login(existingUser);
  }
}
