import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/entities/user.entity';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName!: string;
}

export class LoginQueryDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role parameter must be either ADMIN or USER' })
  role!: UserRole;
}
