import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import {addMovie, getMovies, getMovieByBarcode, assignBarcodeToMovie, Movie} from './db';

export default function AddMovie({navigation, route}: any) {
    const movieData = route.params?.movieData;
    const barcode = route.params?.barcode;

    const [title, setTitle] = useState(movieData?.title || "");
    const [year, setYear] = useState(movieData?.year?.toString() || "");
    const [overview, setOverview] = useState(movieData?.overview || "");
    const [scannedBarcode, setScannedBarcode] = useState<string>(barcode || "");

    const reload = route.params?.reload;

    useEffect(() => {
        if (movieData) {
            Alert.alert(
                'Movie Found!',
                `Found: ${movieData.title} (${movieData.year}). Review and save to add to your collection.`,
                [{ text: 'OK' }]
            );
        }
    }, [movieData]);

    async function handleAdd() {
        if (!title || !year) return;
        await addMovie(title, year, scannedBarcode || undefined);
        if (reload) await reload();
        navigation.goBack();
    }


    return (
        <View style={{flex: 1, padding: 20, justifyContent: 'center'}}>
            <Text>Title:</Text>
            <TextInput value={title} onChangeText={setTitle} style={{borderWidth: 1, marginBottom: 10, padding: 5}}/>

            <Text>Year:</Text>
            <TextInput value={year} onChangeText={setYear} style={{borderWidth: 1, marginBottom: 20, padding: 5}}
                       keyboardType="numeric"/>

            <Button title="Add Movie" onPress={handleAdd}/>
        </View>
    );
}

const handleBarcodeScanned = async (barcode: string) => {
    // Check if barcode already exists
    const existingMovie = await getMovieByBarcode(barcode);

    if (existingMovie) {
        Alert.alert('Movie Found', `This barcode is already assigned to: ${existingMovie.title} (${existingMovie.year})`);
        return;
    }

    // Show options: assign to existing movie or create new one
    Alert.alert(
        'Barcode Scanned',
        'What would you like to do?',
        [
            {
                text: 'Assign to Existing Movie',
                onPress: () => showMovieSelector(barcode)
            },
            {
                text: 'Create New Movie',
                onPress: () => createNewMovieWithBarcode(barcode)
            },
            {
                text: 'Cancel',
                style: 'cancel'
            }
        ]
    );
};

const showMovieSelector = async (barcode: string) => {
    const movies = await getMovies();

    Alert.alert(
        'Select Movie',
        'Choose a movie to assign this barcode to:',
        [
            ...movies.map(movie => ({
                text: `${movie.title} (${movie.year})`,
                onPress: async () => {
                    await assignBarcodeToMovie(movie.id, barcode);
                    Alert.alert('Success', `Barcode assigned to ${movie.title}`);
                }
            })),
            {
                text: 'Cancel',
                style: 'cancel'
            }
        ]
    );
};

const createNewMovieWithBarcode = (barcode: string) => {
    // Set the scanned barcode in state and let user fill in movie details
    setScannedBarcode(barcode);
    Alert.alert('New Movie', 'Please enter the movie details below. The barcode will be automatically assigned.');
};
