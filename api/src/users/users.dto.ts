export class UserResponseDto {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

export class CreateUserDto {
  email: string;
  username: string;
  passwordHash: string;
}
