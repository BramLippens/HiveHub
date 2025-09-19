import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MovieList from "./MovieList";
import AddMovie from "./AddMovie";
import MovieDetails from "./MovieDetails";
import BarcodeScanner from './BarcodeScanner';
import ProfileScreenWrapper from './ProfileScreenWrapper';


const Stack = createNativeStackNavigator();

export default function MoviesModule() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MovieList"
                component={MovieList}
                options={{title: "Movies"}}
            />
            <Stack.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={{title: "Movie Details"}}
            />
            <Stack.Screen
                name="AddMovie"
                component={AddMovie}
                options={{title: "Add Movie"}}
            />
            <Stack.Screen
                name="BarcodeScanner"
                component={BarcodeScanner}
                options={{title: "Scan Barcode"}}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreenWrapper}
                options={{title: "Profile"}}
            />
        </Stack.Navigator>
    );
}
