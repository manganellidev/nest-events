import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUser, User } from './user.entity';
import { ListUsersFilter } from './input/list-users.filter';
import { CreateUserDto } from './input/create-user.dto';
import { BaseService } from 'src/common/base.service';
import { v4 as uuidv4 } from 'uuid';
import { generateUsers } from './users.seed';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService extends BaseService<IUser, ListUsersFilter> {
  constructor(
    private readonly userEntity: User,
    private readonly authService: AuthService,
  ) {
    super();
    generateUsers(100).forEach((u) => this.userEntity.save(u));
  }

  async save(newUser: CreateUserDto): Promise<IUser>;
  async save(updateUser: IUser): Promise<IUser>;
  async save(userToBeSaved: CreateUserDto | IUser): Promise<IUser> {
    let user = {} as IUser;

    if (!(userToBeSaved instanceof User)) {
      user = new User();
      user.id = uuidv4();
      userToBeSaved.password = await this.authService.hashPassword(
        userToBeSaved.password,
      );
    }

    Object.assign(user, userToBeSaved);

    for (const [key, value] of this.userEntity.users.entries()) {
      if (key === user.id) {
        continue;
      }

      if (value.email === user.email || value.username === user.username) {
        throw new BadRequestException(['Username or email already taken.']);
      }
    }

    this.userEntity.save(user);

    return user;
  }

  findById(id: string) {
    return this.userEntity.users.get(id);
  }

  findByUsername(username: string) {
    for (const user of this.userEntity.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  findAll(filter: ListUsersFilter) {
    const foundUsers = [];
    if (Object.keys(filter).every((key) => filter[key] === undefined)) {
      return [...this.userEntity.users.values()];
    }

    for (const user of this.userEntity.users.values()) {
      if (
        filter?.email === user.email ||
        filter?.username === user.username ||
        filter?.firstName === user.firstName ||
        filter?.lastName === user.lastName
      ) {
        foundUsers.push(user);
      }
    }

    return foundUsers.length ? foundUsers : [];
  }

  delete(id: string): void {
    const isUserDeleted = this.userEntity.users.delete(id);

    if (!isUserDeleted) {
      throw new NotFoundException('Resource not found.');
    }
  }
}
