export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  barcode: string;
  genre: string;
  rating?: number;
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    releaseYear: 1994,
    barcode: '883929305773',
    genre: 'Drama',
    rating: 9.3,
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    releaseYear: 1972,
    barcode: '097363344049',
    genre: 'Crime',
    rating: 9.2,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    releaseYear: 2008,
    barcode: '085391174080',
    genre: 'Action',
    rating: 9.0,
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    releaseYear: 1994,
    barcode: '031398187486',
    genre: 'Crime',
    rating: 8.9,
  },
  {
    id: 5,
    title: 'Inception',
    director: 'Christopher Nolan',
    releaseYear: 2010,
    barcode: '883929044511',
    genre: 'Sci-Fi',
    rating: 8.8,
  },
];
