import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  providers: [User, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
