import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(0)
  @MaxLength(200)
  about?: string;

  @IsString()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
