import { UserResponseDto } from '../users/users.dto';

export class RegisterRequestDto {
  email: string;
  username: string;
  password: string;
}

export class LoginRequestDto {
  email: string;
  password: string;
}

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}
