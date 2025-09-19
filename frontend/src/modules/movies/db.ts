import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import { getCurrentUser } from '../auth';

export interface Movie {
    id: string;
    title: string;
    year: string;
    barcode?: string;
    userId: string; // Associate movie with user
    createdAt: string;

    // Metadata fields
    tmdbId?: number;
    overview?: string;
    poster?: string;
    runtime?: number;
    genres?: string[];
    director?: string;
    cast?: string[];
    rating?: number;
    type?: 'movie' | 'tv';
}

const STORAGE_KEY = 'movies_collection';

// initialize DB (optional, just ensures key exists)
export async function initDB() {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

// Get all movies from storage
async function getAllMoviesFromStorage(): Promise<Movie[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save all movies to storage
async function saveAllMoviesToStorage(movies: Movie[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// fetch movies for current user
export async function getMovies(): Promise<Movie[]> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    return allMovies.filter(movie => movie.userId === currentUser.id);
}

// add a movie for current user
export async function addMovie(title: string, year: string, barcode?: string): Promise<void> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const newMovie: Movie = {
        id: uuidv4(),
        title,
        year,
        barcode,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };

    console.log("Adding movie:", newMovie);
    allMovies.push(newMovie);
    await saveAllMoviesToStorage(allMovies);
}

// Add movie with metadata
export async function addMovieWithMetadata(
    title: string,
    year: string,
    metadata?: Partial<Movie>,
    barcode?: string
): Promise<void> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const newMovie: Movie = {
        id: uuidv4(),
        title,
        year,
        barcode,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        ...metadata // Spread metadata fields
    };

    console.log("Adding movie with metadata:", newMovie);
    allMovies.push(newMovie);
    await saveAllMoviesToStorage(allMovies);
}

// clear movies for current user only
export async function clearMovies() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const otherUsersMovies = allMovies.filter(movie => movie.userId !== currentUser.id);
    await saveAllMoviesToStorage(otherUsersMovies);
}

export async function getMovieById(id: string): Promise<Movie | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const movie = allMovies.find(movie => movie.id === id && movie.userId === currentUser.id);
    return movie || null;
}

export async function getMovieByBarcode(barcode: string): Promise<Movie | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    console.log("Searching for barcode:", barcode);
    const allMovies = await getAllMoviesFromStorage();
    const movie = allMovies.find(movie => movie.barcode === barcode && movie.userId === currentUser.id);
    console.log("Found movie:", movie);
    return movie || null;
}

export async function assignBarcodeToMovie(movieId: string, barcode: string): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const movieIndex = allMovies.findIndex(movie =>
        movie.id === movieId && movie.userId === currentUser.id
    );

    if (movieIndex !== -1) {
        allMovies[movieIndex].barcode = barcode;
        await saveAllMoviesToStorage(allMovies);
        return true;
    }

    return false;
}

// Update movie metadata
export async function updateMovieMetadata(movieId: string, metadata: Partial<Movie>): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const allMovies = await getAllMoviesFromStorage();
    const movieIndex = allMovies.findIndex(movie =>
        movie.id === movieId && movie.userId === currentUser.id
    );

    if (movieIndex !== -1) {
        allMovies[movieIndex] = {
            ...allMovies[movieIndex],
            ...metadata
        };
        await saveAllMoviesToStorage(allMovies);
        return true;
    }

    return false;
}
