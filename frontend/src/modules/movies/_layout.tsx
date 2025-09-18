import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MovieList from './MovieList';
import MovieDetails from './MovieDetails';
import AddMovie from './AddMovie';

const Stack = createStackNavigator();

export default function MoviesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MovieList" component={MovieList} options={{title: "My Movies"}}/>
            <Stack.Screen name="MovieDetails" component={MovieDetails} options={{title: "Movie Details"}}/>
            <Stack.Screen name="AddMovie" component={AddMovie} options={{title: "Add Movie"}}/>
        </Stack.Navigator>
    );
}
