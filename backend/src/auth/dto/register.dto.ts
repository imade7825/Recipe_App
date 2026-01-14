import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  //Mindestlänge als basic-Schutz
  @IsString()
  @MinLength(6)
  password: string;
}
