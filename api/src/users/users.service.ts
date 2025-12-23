import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { DatabaseProvider } from '../drizzle/drizzle.provider';
import { InjectDrizzle } from '../drizzle/drizzle.provider';
import { users } from '../drizzle/schema';
import { CreateUserDto, UserResponseDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user || null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.username, username),
    });

    return user || null;
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user || null;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const [newUser] = await this.db
      .insert(users)
      .values(createUserDto)
      .$returningId();

    const user = await this.findById(newUser.id);

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }
}
