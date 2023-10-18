import { IsEmail, IsStrongPassword, Length } from 'class-validator';
import { IUser } from '../user.entity';

export class CreateUserDto implements Omit<IUser, 'id'> {
  @Length(2)
  firstName: string;
  @Length(2)
  lastName: string;
  @Length(5)
  username: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
