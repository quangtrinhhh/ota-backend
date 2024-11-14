
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { User } from 'src/models/user.model';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.finByEmail(username);
    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return '123';
  }
}
