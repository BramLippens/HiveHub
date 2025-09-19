import React, {useState} from "react";
import {View, Text, Button, FlatList, TextInput, TouchableOpacity, StyleSheet, Image} from "react-native";
import {getMovies, initDB, Movie} from "./db";
import {useFocusEffect} from "@react-navigation/native";

export default function MovieList({navigation}: any) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState("");

    async function loadMovies() {
        try {
            await initDB(); // ensure DB is ready
            const data = await getMovies();
            setMovies(data);
        } catch (error) {
            console.error('Error loading movies:', error);
            // Handle authentication error gracefully
            if (error.message === 'User not authenticated') {
                // This shouldn't happen if auth is working properly
                console.log('User not authenticated, movies will be empty');
                setMovies([]);
            }
        }
    }

    // reload whenever screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            loadMovies();
        }, [])
    );

    const filtered = movies.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.genres?.some(genre => genre.toLowerCase().includes(search.toLowerCase())) ||
        m.director?.toLowerCase().includes(search.toLowerCase())
    );

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("MovieDetails", {movieId: item.id})}
            style={styles.movieItem}
        >
            <View style={styles.movieContent}>
                {item.poster ? (
                    <Image source={{ uri: item.poster }} style={styles.poster} />
                ) : (
                    <View style={styles.placeholderPoster}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}

                <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{item.title}</Text>
                    <Text style={styles.movieYear}>
                        {item.type === 'tv' ? 'TV Series' : 'Movie'} • {item.year}
                    </Text>

                    {item.rating && (
                        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}/10</Text>
                    )}

                    {item.genres && item.genres.length > 0 && (
                        <Text style={styles.genres}>
                            {item.genres.slice(0, 2).join(', ')}
                        </Text>
                    )}

                    {item.director && (
                        <Text style={styles.director}>
                            {item.type === 'tv' ? 'Creator' : 'Director'}: {item.director}
                        </Text>
                    )}

                    {item.barcode && (
                        <Text style={styles.barcode}>📱 {item.barcode}</Text>
                    )}

                    {!item.poster && !item.overview && (
                        <Text style={styles.noMetadata}>Tap to add metadata</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{flex: 1, padding: 20}}>
            {/* Header with profile button */}
            <View style={styles.header}>
                <Text style={styles.title}>My Movies</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Text style={styles.profileButtonText}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <TextInput
                placeholder="Search by title, genre, or director..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
            />

            <View style={styles.buttonRow}>
                <Button title="Add Movie" onPress={() => navigation.navigate("AddMovie", { reload: loadMovies })}/>
                <Button title="Scan Barcode" onPress={() => navigation.navigate("BarcodeScanner")}/>
            </View>

            {/* Movie list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderMovieItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No movies found</Text>
                        <Text style={styles.emptySubtext}>Add your first movie or scan a barcode to get started</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
    },
    profileButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    movieItem: {
        backgroundColor: 'white',
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    movieContent: {
        flexDirection: 'row',
        padding: 15,
    },
    poster: {
        width: 60,
        height: 90,
        borderRadius: 8,
        marginRight: 15,
    },
    placeholderPoster: {
        width: 60,
        height: 90,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 10,
        textAlign: 'center',
    },
    movieInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    movieYear: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        color: '#FF9500',
        marginBottom: 4,
    },
    genres: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    director: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    barcode: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    noMetadata: {
        fontSize: 12,
        color: '#007AFF',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});
