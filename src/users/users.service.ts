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

@Injectable()
export class UsersService extends BaseService<IUser, ListUsersFilter> {
  constructor(private readonly userEntity: User) {
    super();
    generateUsers(1000).forEach((u) => this.userEntity.save(u));
  }

  save(newUser: CreateUserDto): IUser;
  save(updateUser: IUser): IUser;
  save(userToBeSaved: CreateUserDto | IUser): IUser {
    let user = {} as IUser;

    if (!(userToBeSaved instanceof User)) {
      user = new User();
      user.id = uuidv4();
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
