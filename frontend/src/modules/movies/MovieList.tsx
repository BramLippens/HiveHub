import React, {useState} from "react";
import {View, Text, Button, FlatList, TextInput, TouchableOpacity} from "react-native";
import {getMovies, initDB, Movie} from "./db";
import {useFocusEffect} from "@react-navigation/native";

export default function MovieList({navigation}: any) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState("");

    async function loadMovies() {
        await initDB(); // ensure DB is ready
        const data = await getMovies();
        setMovies(data);
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

            <Button title="Add Movie" onPress={() => navigation.navigate("AddMovie")}/>
            <Button title="Scan Barcode" onPress={() => navigation.navigate("BarcodeScanner")}/>

            {/* Movie list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("MovieDetails", {movieId: item.id})
                        }
                        style={{marginVertical: 8}}
                    >
                        <Text style={{fontSize: 16}}>
                            {item.title} ({item.year})
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
