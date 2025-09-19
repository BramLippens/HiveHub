import React, {useState} from "react";
import {View, Text, Button, FlatList, TextInput, TouchableOpacity, StyleSheet} from "react-native";
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
        m.title.toLowerCase().includes(search.toLowerCase())
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
                placeholder="Search movies..."
                value={search}
                onChangeText={setSearch}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 8,
                    marginBottom: 12,
                    borderRadius: 6,
                }}
            />

            <View style={styles.buttonRow}>
                <Button title="Add Movie" onPress={() => navigation.navigate("AddMovie", { reload: loadMovies })}/>
                <Button title="Scan Barcode" onPress={() => navigation.navigate("BarcodeScanner")}/>
            </View>

            {/* Movie list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("MovieDetails", {movieId: item.id})
                        }
                        style={styles.movieItem}
                    >
                        <Text style={styles.movieTitle}>
                            {item.title} ({item.year})
                        </Text>
                        {item.barcode && (
                            <Text style={styles.movieBarcode}>
                                Barcode: {item.barcode}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No movies found</Text>
                        <Text style={styles.emptySubtext}>Add your first movie or scan a barcode to get started</Text>
                    </View>
                }
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    movieItem: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    movieBarcode: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
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
