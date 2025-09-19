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
    director?: string;
    cast?: string[];
    rating?: number;
    type: 'movie' | 'tv';
}

// Helper function to create headers with Bearer token
function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
    };
}

export async function searchMovieByTitleAndYear(title: string, year?: string): Promise<MovieData[]> {
    try {
        const results: MovieData[] = [];

        // Search for movies using the correct API format with proper URL encoding
        const movieParams = new URLSearchParams();
        movieParams.append('query', title); // This will properly encode spaces as %20
        movieParams.append('include_adult', 'false');
        movieParams.append('language', 'en-US');
        movieParams.append('page', '1');

        if (year) {
            movieParams.append('year', year);
        }

        const movieUrl = `${TMDB_BASE_URL}/search/movie?${movieParams.toString()}`;
        console.log('Searching movies with URL:', movieUrl);

        const movieResponse = await fetch(movieUrl, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!movieResponse.ok) {
            console.error('Movie search failed:', movieResponse.status, await movieResponse.text());
        }

        const movieData = await movieResponse.json();

        // Search for TV shows using the correct API format with proper URL encoding
        const tvParams = new URLSearchParams();
        tvParams.append('query', title); // This will properly encode spaces as %20
        tvParams.append('include_adult', 'false');
        tvParams.append('language', 'en-US');
        tvParams.append('page', '1');

        if (year) {
            tvParams.append('first_air_date_year', year);
        }

        const tvUrl = `${TMDB_BASE_URL}/search/tv?${tvParams.toString()}`;
        console.log('Searching TV shows with URL:', tvUrl);

        const tvResponse = await fetch(tvUrl, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!tvResponse.ok) {
            console.error('TV search failed:', tvResponse.status, await tvResponse.text());
        }

        const tvData = await tvResponse.json();

        // Process movie results
        if (movieData.results) {
            for (const movie of movieData.results.slice(0, 5)) { // Limit to top 5 results
                const detailData = await getMovieDetails(movie.id);
                if (detailData) {
                    results.push({
                        ...detailData,
                        type: 'movie',
                        year: movie.release_date ? new Date(movie.release_date).getFullYear() : parseInt(year || '0')
                    });
                }
            }
        }

        // Process TV show results
        if (tvData.results) {
            for (const show of tvData.results.slice(0, 5)) { // Limit to top 5 results
                const detailData = await getTVDetails(show.id);
                if (detailData) {
                    results.push({
                        ...detailData,
                        type: 'tv',
                        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : parseInt(year || '0')
                    });
                }
            }
        }

        return results;
    } catch (error) {
        console.error('TMDb search error:', error);
        return [];
    }
}

async function getMovieDetails(movieId: number): Promise<Partial<MovieData> | null> {
    try {
        const [detailResponse, creditsResponse] = await Promise.all([
            fetch(`${TMDB_BASE_URL}/movie/${movieId}?language=en-US`, {
                headers: getAuthHeaders()
            }),
            fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?language=en-US`, {
                headers: getAuthHeaders()
            })
        ]);

        if (!detailResponse.ok || !creditsResponse.ok) {
            console.error('Failed to fetch movie details:', detailResponse.status, creditsResponse.status);
            return null;
        }

        const detailData = await detailResponse.json();
        const creditsData = await creditsResponse.json();

        const director = creditsData.crew?.find((person: any) => person.job === 'Director')?.name;
        const cast = creditsData.cast?.slice(0, 5).map((actor: any) => actor.name) || [];

        return {
            id: movieId,
            title: detailData.title,
            overview: detailData.overview,
            poster: detailData.poster_path ? `https://image.tmdb.org/t/p/w500${detailData.poster_path}` : null,
            runtime: detailData.runtime,
            genres: detailData.genres?.map((g: any) => g.name) || [],
            director,
            cast,
            rating: detailData.vote_average
        };
    } catch (error) {
        console.error('Error getting movie details:', error);
        return null;
    }
}

async function getTVDetails(tvId: number): Promise<Partial<MovieData> | null> {
    try {
        const [detailResponse, creditsResponse] = await Promise.all([
            fetch(`${TMDB_BASE_URL}/tv/${tvId}?language=en-US`, {
                headers: getAuthHeaders()
            }),
            fetch(`${TMDB_BASE_URL}/tv/${tvId}/credits?language=en-US`, {
                headers: getAuthHeaders()
            })
        ]);

        if (!detailResponse.ok || !creditsResponse.ok) {
            console.error('Failed to fetch TV details:', detailResponse.status, creditsResponse.status);
            return null;
        }

        const detailData = await detailResponse.json();
        const creditsData = await creditsResponse.json();

        const creator = detailData.created_by?.[0]?.name;
        const cast = creditsData.cast?.slice(0, 5).map((actor: any) => actor.name) || [];

        return {
            id: tvId,
            title: detailData.name,
            overview: detailData.overview,
            poster: detailData.poster_path ? `https://image.tmdb.org/t/p/w500${detailData.poster_path}` : null,
            runtime: detailData.episode_run_time?.[0],
            genres: detailData.genres?.map((g: any) => g.name) || [],
            director: creator, // Use creator as director for TV shows
            cast,
            rating: detailData.vote_average
        };
    } catch (error) {
        console.error('Error getting TV details:', error);
        return null;
    }
}

export async function searchMovieByBarcode(barcode: string): Promise<MovieData | null> {
    try {
        // Try searching by the barcode as a query
        const params = new URLSearchParams({
            query: barcode,
            include_adult: 'false',
            language: 'en-US',
            page: '1'
        });

        const searchResponse = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
            headers: getAuthHeaders()
        });

        if (!searchResponse.ok) {
            console.error('Failed to search by barcode:', searchResponse.status);
            return null;
        }

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const movie = searchData.results[0];
            const detailData = await getMovieDetails(movie.id);

            if (detailData) {
                return {
                    ...detailData,
                    type: 'movie',
                    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0
                } as MovieData;
            }
        }

        return null;
    } catch (error) {
        console.error('TMDb API error:', error);
        return null;
    }
}
