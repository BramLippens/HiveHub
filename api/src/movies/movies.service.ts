import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { movies } from '../drizzle/schema';
import {
  CreateMovieRequestDto,
  UpdateMovieRequestDto,
  MovieResponseDto,
  MovieListResponseDto,
} from './movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<MovieListResponseDto> {
    const items = await this.db.query.movies.findMany();
    return {
      items,
      count: items.length,
    };
  }

  async getById(id: number): Promise<MovieResponseDto> {
    const movie = await this.db.query.movies.findFirst({
      where: eq(movies.id, id),
    });

    if (!movie) {
      throw new NotFoundException(`No movie with id ${id} exists`);
    }

    return movie;
  }

  async searchByBarcode(barcode: string): Promise<MovieResponseDto> {
    const movie = await this.db.query.movies.findFirst({
      where: eq(movies.barcode, barcode),
    });

    if (!movie) {
      throw new NotFoundException(`No movie with barcode ${barcode} exists`);
    }

    return movie;
  }

  async create(createDto: CreateMovieRequestDto): Promise<MovieResponseDto> {
    const [newMovie] = await this.db
      .insert(movies)
      .values(createDto)
      .$returningId();

    return this.getById(newMovie.id);
  }

  async update(
    id: number,
    updateDto: UpdateMovieRequestDto,
  ): Promise<MovieResponseDto> {
    await this.db.update(movies).set(updateDto).where(eq(movies.id, id));

    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const [result] = await this.db.delete(movies).where(eq(movies.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException(`No movie with id ${id} exists`);
    }
  }
}
