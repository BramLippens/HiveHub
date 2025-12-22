import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  CreateMovieRequestDto,
  UpdateMovieRequestDto,
  MovieResponseDto,
  MovieListResponseDto,
} from './movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAll(
    @Query('barcode') barcode?: string,
  ): Promise<MovieListResponseDto | MovieResponseDto> {
    if (barcode) {
      return this.moviesService.searchByBarcode(barcode);
    }
    return this.moviesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<MovieResponseDto> {
    return this.moviesService.getById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateMovieRequestDto): Promise<MovieResponseDto> {
    return this.moviesService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMovieRequestDto,
  ): Promise<MovieResponseDto> {
    return this.moviesService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.moviesService.delete(Number(id));
  }
}
