import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface Movie {
  id: string;
  title: string;
  year: string;
}

const STORAGE_KEY = 'movies_collection';

// initialize DB (optional, just ensures key exists)
export async function initDB() {
  const existing = await AsyncStorage.getItem(STORAGE_KEY);
  if (!existing) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

// fetch all movies
export async function getMovies(): Promise<Movie[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// add a movie
export async function addMovie(title: string, year: string): Promise<void> {
  const movies = await getMovies();
  movies.push({ id: uuidv4(), title, year });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// clear movies (optional)
export async function clearMovies() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

export async function getMovieById(id: string): Promise<Movie | null> {
    const movies = await getMovies();
    const movie = movies.find(movie => movie.id === id);
    return movie || null;
}