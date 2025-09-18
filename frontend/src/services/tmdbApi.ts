import { TMDB_API_KEY } from '@env';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieData {
    id: number;
    title: string;
    year: number;
    overview: string;
    poster: string | null;
    runtime?: number;
    genres?: string[];
}

export async function searchMovieByBarcode(barcode: string): Promise<MovieData | null> {
    try {
        // Try searching by the barcode as a query
        const searchResponse = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${barcode}`
        );

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const movie = searchData.results[0];

            // Get detailed movie info
            const detailResponse = await fetch(
                `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`
            );

            const detailData = await detailResponse.json();

            return {
                id: movie.id,
                title: movie.title,
                year: new Date(movie.release_date).getFullYear(),
                overview: movie.overview,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                runtime: detailData.runtime,
                genres: detailData.genres?.map((g: any) => g.name) || []
            };
        }

        return null;
    } catch (error) {
        console.error('TMDb API error:', error);
        return null;
    }
}
