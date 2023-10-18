import { Injectable } from '@nestjs/common';
import { Exclude } from 'class-transformer';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class User implements IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;

  private _users: Map<string, IUser> = new Map();

  get users() {
    return this._users;
  }

  save(user: IUser) {
    return this.users.set(user.id, user);
  }
}
