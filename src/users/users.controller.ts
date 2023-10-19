import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './input/create-user.dto';
import { UpdateUserDto } from './input/update-user.dto';
import { ListUsersFilter } from './input/list-users.filter';
import { UsersService } from './users.service';

@Controller('users')
@SerializeOptions({ excludePrefixes: ['_'] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListUsersFilter) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.findById(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateUserDto) {
    return this.usersService.save(input);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Param('id', ParseUUIDPipe) id, @Body() input: UpdateUserDto) {
    const user = this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const userToBeUpdated = Object.assign(user, input);
    return this.usersService.save(userToBeUpdated);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id) {
    this.usersService.delete(id);
  }
}
