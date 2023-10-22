import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, (user as IUser).password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
