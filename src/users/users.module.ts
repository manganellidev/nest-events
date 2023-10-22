import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [User, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
