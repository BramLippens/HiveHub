import { Tabs } from "expo-router";

const modules = [
  { name: "movies", title: "Movies" },
  { name: "books", title: "Books" },
];

export default function AppLayout() {
  return (
    <Tabs>
      {modules.map((mod) => (
        <Tabs.Screen
          key={mod.name}
          name={`modules/${mod.name}`}
          options={{ title: mod.title }}
        />
      ))}
    </Tabs>
  );
}
