import { Controller, Get } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  @Get()
  findAll() {
    return [
      { id: 1, title: 'The Matrix', year: 1999 },
      { id: 2, title: 'Inception', year: 2010 },
    ];
  }
}
