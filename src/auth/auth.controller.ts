import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@Request() req) {
    return {
      userId: req.user.id,
      token: await this.authService.generateJwt(req.user),
    };
  }
}
