import React, {useState, useEffect} from "react";
import {View, Text} from "react-native";
import {getMovieByBarcode, getMovieById, Movie} from "./db";

export default function MovieDetails({navigation, route}: any) {
    const [movie, setMovie] = useState<Movie | null>(null);
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

    if (!movie) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1, padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: "bold"}}>{movie.title}</Text>
            <Text style={{fontSize: 18, marginTop: 10}}>Year: {movie.year}</Text>
            {movie.barcode && (
                <Text style={{fontSize: 16, marginTop: 10}}>Barcode: {movie.barcode}</Text>
            )}
        </View>
    );
}
