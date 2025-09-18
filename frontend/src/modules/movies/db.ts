import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';

export interface Movie {
    id: string;
    title: string;
    year: string;
    barcode?: string;
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
export async function addMovie(title: string, year: string, barcode?: string): Promise<void> {
    const movies = await getMovies();
    console.log("Adding movie:", {title, year, barcode});
    movies.push({id: uuidv4(), title, year, barcode});
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

export async function getMovieByBarcode(barcode: string): Promise<Movie | null> {
    console.log("Searching for barcode:", barcode);
    const movies = await getMovies();
    const movie = movies.find(movie => movie.barcode === barcode);
    console.log("Found movie:", movie);
    return movie || null;
}

export async function assignBarcodeToMovie(movieId: string, barcode: string): Promise<boolean> {
    const movies = await getMovies();
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex !== -1) {
        movies[movieIndex].barcode = barcode;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
        return true;
    }
    return false;
}