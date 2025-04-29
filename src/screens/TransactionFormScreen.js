import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform, StatusBar, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storeTransaction } from '../utils/storage';

const CATEGORIES = [
  'Groceries',
  'Rent',
  'Utilities',
  'Dining',
  'Transport',
  'Health',
  'Entertainment',
  'Other',
];

export default function TransactionFormScreen({ navigation, onLogout }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [attachment, setAttachment] = useState(null); // { uri, type: 'image' } or { note, type: 'note' }
  const [note, setNote] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachment({ uri: result.assets[0].uri, type: 'image' });
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || isNaN(Number(amount))) {
      Alert.alert('Validation', 'Please enter a valid description and amount.');
      return;
    }
    const transaction = {
      id: Date.now().toString(),
      description,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
      attachment: attachment ? attachment : note ? { note, type: 'note' } : null,
    };
    await storeTransaction(transaction);
    Alert.alert('Success', 'Transaction added!');
    setDescription('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setNote('');
    setAttachment(null);
    if (navigation?.goBack) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Transaction</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryPicker}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
          <Text style={styles.attachBtnText}>{attachment && attachment.type === 'image' ? 'Change Photo' : 'Add Receipt Photo'}</Text>
        </TouchableOpacity>
        {attachment && attachment.type === 'image' && (
          <Image source={{ uri: attachment.uri }} style={styles.attachmentPreview} />
        )}
        <Text style={styles.label}>Or Add Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a note (optional)"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'flex-start',
    gap: 8,
  },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: '45%',
  },
  categoryBtnActive: {
    backgroundColor: '#2b6cb0',
    borderColor: '#2b6cb0',
  },
  categoryBtnText: {
    color: '#334155',
    fontSize: 15,
    flexShrink: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  categoryBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  attachBtn: {
    marginTop: 16,
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  attachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  attachmentPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
