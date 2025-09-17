import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { getMovies, initDB, Movie } from './db';

export default function MovieList({ navigation }: any) {
  const [movies, setMovies] = useState<Movie[]>([]);

  async function loadMovies() {
    await initDB();
    const all = await getMovies();
    setMovies(all);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add Movie" onPress={() => navigation.navigate('AddMovie', { reload: loadMovies })} />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8 }}>
            <Text>{item.title} ({item.year})</Text>
          </View>
        )}
      />
    </View>
  );
}
