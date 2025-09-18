import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { getMovieById, Movie } from "./db";

export default function MovieDetails({ navigation, route }: any) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const { movieId } = route.params;

    useEffect(() => {
        async function loadMovie() {
            const movieData = await getMovieById(movieId);
            setMovie(movieData);
        }
        loadMovie();
    }, [movieId]);

    if (!movie) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>{movie.title}</Text>
            <Text style={{ fontSize: 18, marginTop: 10 }}>Year: {movie.year}</Text>
        </View>
    );
}
