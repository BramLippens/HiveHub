import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { getMovies, getMovieByBarcode, Movie } from './db';

export default function BarcodeScanner({ navigation }: any) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        setLoading(true);

        try {
            // Check if barcode already exists
            const existingMovie = await getMovieByBarcode(data);

            if (existingMovie) {
                navigation.navigate('MovieDetails', { movie: existingMovie });
                return;
            }

            // Show options: assign to existing movie or create new one
            Alert.alert(
                'Barcode Scanned',
                'What would you like to do?',
                [
                    {
                        text: 'Assign to Existing Movie',
                        onPress: () => showMovieSelector(data)
                    },
                    {
                        text: 'Create New Movie',
                        onPress: () => navigation.navigate('AddMovie', { barcode: data })
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => setScanned(false)
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to process barcode. Please try again.');
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    const showMovieSelector = async (barcode: string) => {
        const movies = await getMovies();

        if (movies.length === 0) {
            Alert.alert('No Movies', 'You have no movies in your collection yet.');
            return;
        }

        Alert.alert(
            'Select Movie',
            'Choose a movie to assign this barcode to:',
            [
                ...movies.map(movie => ({
                    text: `${movie.title} (${movie.year})`,
                    onPress: () => navigation.navigate('AddMovie', {
                        movieToUpdate: movie,
                        barcode: barcode
                    })
                })),
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => setScanned(false)
                }
            ]
        );
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a'],
                }}
            />
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Processing barcode...</Text>
                </View>
            )}
            {scanned && !loading && (
                <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            )}
            <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    camera: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
});
