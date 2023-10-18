import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ListUsersFilter extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}
