import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {getMovieByBarcode, getMovieById, Movie, updateMovieMetadata} from "./db";
import {searchMovieByTitleAndYear} from "../../services/tmdbApi";

export default function MovieDetails({route}: any) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
    const {movieId, movie: passedMovie} = route.params;
    const barcode = route.params?.barcode;

    useEffect(() => {
        async function loadMovie() {
            // If movie object is passed directly, use it
            if (passedMovie) {
                setMovie(passedMovie);
                return;
            }

            console.log("Loading movie details for ID:", movieId, "or barcode:", barcode);
            if (barcode) {
                const movieData = await getMovieByBarcode(barcode);
                console.log("Loaded movie by barcode:", movieData);
                if (movieData) {
                    setMovie(movieData);
                }
            } else if (movieId) {
                const movieData = await getMovieById(movieId);
                setMovie(movieData);
            }
        }

        loadMovie();
    }, [movieId, barcode, passedMovie]);

    const handleFetchMetadata = async () => {
        if (!movie) return;

        setIsLoadingMetadata(true);
        try {
            const results = await searchMovieByTitleAndYear(movie.title, movie.year);

            if (results.length > 0) {
                const metadata = results[0]; // Take the first result

                await updateMovieMetadata(movie.id, {
                    tmdbId: metadata.id,
                    overview: metadata.overview,
                    poster: metadata.poster,
                    runtime: metadata.runtime,
                    genres: metadata.genres,
                    director: metadata.director,
                    cast: metadata.cast,
                    rating: metadata.rating,
                    type: metadata.type
                });

                // Update local state
                setMovie({
                    ...movie,
                    tmdbId: metadata.id,
                    overview: metadata.overview,
                    poster: metadata.poster,
                    runtime: metadata.runtime,
                    genres: metadata.genres,
                    director: metadata.director,
                    cast: metadata.cast,
                    rating: metadata.rating,
                    type: metadata.type
                });

                Alert.alert('Success', 'Metadata updated successfully!');
            } else {
                Alert.alert('No Results', 'No metadata found for this title and year.');
            }
        } catch (error) {
            console.error('Fetch metadata error:', error);
            Alert.alert('Error', 'Failed to fetch metadata. Please try again.');
        } finally {
            setIsLoadingMetadata(false);
        }
    };

    if (!movie) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const hasMetadata = movie.tmdbId || movie.overview || movie.poster;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.posterContainer}>
                    {movie.poster ? (
                        <Image source={{ uri: movie.poster }} style={styles.poster} />
                    ) : (
                        <View style={styles.placeholderPoster}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.year}>{movie.year}</Text>

                    {movie.type && (
                        <Text style={styles.type}>
                            {movie.type === 'tv' ? 'TV Series' : 'Movie'}
                        </Text>
                    )}

                    {movie.rating && (
                        <Text style={styles.rating}>⭐ {movie.rating.toFixed(1)}/10</Text>
                    )}

                    {movie.genres && movie.genres.length > 0 && (
                        <View style={styles.genreContainer}>
                            {movie.genres.slice(0, 3).map((genre, index) => (
                                <Text key={index} style={styles.genre}>{genre}</Text>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {!hasMetadata && (
                <View style={styles.metadataSection}>
                    <Text style={styles.sectionTitle}>Enhance Your Collection</Text>
                    <Text style={styles.sectionSubtitle}>
                        Fetch additional information like plot, cast, and poster
                    </Text>
                    <TouchableOpacity
                        style={styles.fetchButton}
                        onPress={handleFetchMetadata}
                        disabled={isLoadingMetadata}
                    >
                        <Text style={styles.fetchButtonText}>
                            {isLoadingMetadata ? 'Fetching...' : 'Fetch Metadata'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {movie.overview && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Details</Text>

                {movie.director && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {movie.type === 'tv' ? 'Creator:' : 'Director:'}
                        </Text>
                        <Text style={styles.detailValue}>{movie.director}</Text>
                    </View>
                )}

                {movie.runtime && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Runtime:</Text>
                        <Text style={styles.detailValue}>{movie.runtime} minutes</Text>
                    </View>
                )}

                {movie.barcode && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Barcode:</Text>
                        <Text style={styles.detailValue}>{movie.barcode}</Text>
                    </View>
                )}

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Added:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(movie.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {movie.cast && movie.cast.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cast</Text>
                    <Text style={styles.castText}>{movie.cast.join(', ')}</Text>
                </View>
            )}

            {hasMetadata && (
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleFetchMetadata}
                        disabled={isLoadingMetadata}
                    >
                        <Text style={styles.updateButtonText}>
                            {isLoadingMetadata ? 'Updating...' : 'Update Metadata'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    posterContainer: {
        marginRight: 20,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 10,
    },
    placeholderPoster: {
        width: 120,
        height: 180,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    year: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    type: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 5,
    },
    rating: {
        fontSize: 16,
        color: '#FF9500',
        marginBottom: 10,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genre: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        fontSize: 12,
        color: '#333',
        marginRight: 5,
        marginBottom: 5,
    },
    section: {
        backgroundColor: 'white',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    metadataSection: {
        backgroundColor: '#f0f8ff',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    overview: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 100,
    },
    detailValue: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    castText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    fetchButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    fetchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    updateButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
