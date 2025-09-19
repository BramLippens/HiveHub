import "react-native-gesture-handler";
import 'react-native-get-random-values';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthModule from "./src/modules/auth";
import MoviesModule from "./src/modules/movies";

export default function App() {
  return (
    <NavigationContainer>
      <AuthModule>
        <MoviesModule />
      </AuthModule>
    </NavigationContainer>
  );
}
