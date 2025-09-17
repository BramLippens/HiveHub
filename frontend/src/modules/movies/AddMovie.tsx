import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addMovie } from './db';

export default function AddMovie({ navigation, route }: any) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  const reload = route.params?.reload;

  async function handleAdd() {
    if (!title || !year) return;
    await addMovie(title, year);
    if (reload) await reload();
    navigation.goBack();
  }


  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} />

      <Text>Year:</Text>
      <TextInput value={year} onChangeText={setYear} style={{ borderWidth: 1, marginBottom: 20, padding: 5 }} keyboardType="numeric" />

      <Button title="Add Movie" onPress={handleAdd} />
    </View>
  );
}
