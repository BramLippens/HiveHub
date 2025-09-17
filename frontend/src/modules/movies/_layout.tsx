import { Stack } from "expo-router";

export default function MoviesLayout() {
  return (
    <Stack>
      <Stack.Screen name="movie_list" options={{ title: "My Movies" }} />
      <Stack.Screen name="add_movie" options={{ title: "Add Movie" }} />
    </Stack>
  );
}
