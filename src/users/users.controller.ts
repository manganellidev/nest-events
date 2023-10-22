import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './input/create-user.dto';
import { UpdateUserDto } from './input/update-user.dto';
import { ListUsersFilter } from './input/list-users.filter';
import { UsersService } from './users.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from './current-user.decorator';
import { IUser } from './user.entity';

@Controller('users')
@SerializeOptions({ excludePrefixes: ['_'] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListUsersFilter) {
    return this.usersService.findAll(filter);
  }

  // @Get(':id')
  // @UseGuards(AuthGuardJwt)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async find(
  //   @CurrentUser() user: IUser,
  //   @Param('id', ParseUUIDPipe) id: string,
  // ) {
  //   if (user.id !== id) {
  //     throw new UnauthorizedException();
  //   }

  //   if (!user) {
  //     throw new NotFoundException();
  //   }

  //   return user;
  // }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user: IUser) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateUserDto) {
    return this.usersService.save(input);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @CurrentUser() user: IUser,
    @Param('id', ParseUUIDPipe) id,
    @Body() input: UpdateUserDto,
  ) {
    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    const userToBeUpdated = Object.assign(user, input);
    return this.usersService.save(userToBeUpdated);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@CurrentUser() user: IUser, @Param('id', ParseUUIDPipe) id) {
    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    this.usersService.delete(id);
  }
}
