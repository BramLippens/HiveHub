export class MovieResponseDto {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  barcode: string;
  genre: string;
  rating: number | null;
}

export class CreateMovieRequestDto {
  title: string;
  director: string;
  releaseYear: number;
  barcode: string;
  genre: string;
  rating?: number | null;
}

export class UpdateMovieRequestDto {
  title?: string;
  director?: string;
  releaseYear?: number;
  barcode?: string;
  genre?: string;
  rating?: number | null;
}

export class MovieListResponseDto {
  items: MovieResponseDto[];
  count: number;
}
