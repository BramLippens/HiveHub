import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieList from "./MovieList";
import AddMovie from "./AddMovie";

const Stack = createNativeStackNavigator();

export default function MoviesModule() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MovieList"
        component={MovieList}
        options={{ title: "Movies" }}
      />
      <Stack.Screen
        name="AddMovie"
        component={AddMovie}
        options={{ title: "Add Movie" }}
      />
    </Stack.Navigator>
  );
}
