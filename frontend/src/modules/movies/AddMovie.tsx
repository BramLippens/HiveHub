import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Image, ActivityIndicator, ScrollView } from 'react-native';
import { addMovieWithMetadata } from './db';
import { searchMovieByTitleAndYear, MovieData } from '../../services/tmdbApi';

export default function AddMovie({ navigation, route }: any) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [barcode, setBarcode] = useState('');
  const [searchResults, setSearchResults] = useState<MovieData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const reload = route.params?.reload;
  const routeBarcode = route.params?.barcode; // Get barcode from route if coming from scanner

  // Set barcode from route params when component mounts
  React.useEffect(() => {
    if (routeBarcode) {
      setBarcode(routeBarcode);
    }
  }, [routeBarcode]);

  const handleSearch = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title to search');
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMovieByTitleAndYear(title.trim(), year.trim() || undefined);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search for movies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = async (movieData: MovieData) => {
    try {
      await addMovieWithMetadata(
        movieData.title,
        movieData.year.toString(),
        {
          tmdbId: movieData.id,
          overview: movieData.overview,
          poster: movieData.poster,
          runtime: movieData.runtime,
          genres: movieData.genres,
          director: movieData.director,
          cast: movieData.cast,
          rating: movieData.rating,
          type: movieData.type
        },
        barcode.trim() || undefined // Pass barcode if available
      );

      Alert.alert('Success', `${movieData.type === 'tv' ? 'Series' : 'Movie'} added successfully!`, [
        { text: 'OK', onPress: async () => {
          if (reload) await reload();
          navigation.goBack();
        }}
      ]);
    } catch (error) {
      console.error('Add movie error:', error);
      Alert.alert('Error', 'Failed to add movie. Please try again.');
    }
  };

  const handleAddManually = async () => {
    if (!title.trim() || !year.trim()) {
      Alert.alert('Error', 'Please enter both title and year');
      return;
    }

    try {
      await addMovieWithMetadata(
        title.trim(),
        year.trim(),
        undefined, // No metadata for manual add
        barcode.trim() || undefined // Pass barcode if available
      );
      Alert.alert('Success', 'Movie added successfully!', [
        { text: 'OK', onPress: async () => {
          if (reload) await reload();
          navigation.goBack();
        }}
      ]);
    } catch (error) {
      console.error('Add movie error:', error);
      Alert.alert('Error', 'Failed to add movie. Please try again.');
    }
  };

  const renderMovieItem = ({ item }: { item: MovieData }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => handleSelectMovie(item)}>
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
          <Text style={styles.movieType}>
            {item.type === 'tv' ? 'TV Series' : 'Movie'} • {item.year}
          </Text>

          {item.rating && (
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}/10</Text>
          )}

          {item.genres && item.genres.length > 0 && (
            <Text style={styles.genres}>{item.genres.slice(0, 3).join(', ')}</Text>
          )}

          {item.director && (
            <Text style={styles.director}>
              {item.type === 'tv' ? 'Creator' : 'Director'}: {item.director}
            </Text>
          )}

          {item.overview && (
            <Text style={styles.overview} numberOfLines={2}>
              {item.overview}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Search for Movie or Series</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Enter movie or series title"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Year (Optional)</Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            style={styles.input}
            placeholder="Enter year"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barcode (Optional)</Text>
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            style={styles.input}
            placeholder="Enter barcode or scan with barcode scanner"
          />
          {routeBarcode && (
            <Text style={styles.barcodeHint}>
              📱 Barcode from scanner: {routeBarcode}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.searchButton]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {hasSearched && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>
            Search Results ({searchResults.length})
          </Text>

          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              renderItem={renderMovieItem}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with a different title or year
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.manualSection}>
        <Text style={styles.sectionTitle}>Or Add Manually</Text>
        <Text style={styles.sectionSubtitle}>
          Add without fetching metadata from online databases
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.manualButton]}
          onPress={handleAddManually}
        >
          <Text style={styles.buttonText}>Add Manually</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchSection: {
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
  resultsSection: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  manualSection: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
  },
  manualButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  movieItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  movieContent: {
    flexDirection: 'row',
    padding: 15,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderPoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  movieType: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 5,
  },
  genres: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  director: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  overview: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  barcodeHint: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
});
