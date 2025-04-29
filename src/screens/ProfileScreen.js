import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'profile_info';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(''); // Placeholder for future avatar upload

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(PROFILE_KEY);
      if (saved) {
        const { name, email, avatar } = JSON.parse(saved);
        setName(name || '');
        setEmail(email || '');
        setAvatar(avatar || '');
      }
    })();
  }, []);

  const saveProfile = async () => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email, avatar }));
    Alert.alert('Profile Saved', 'Your profile information has been updated.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Profile screen heading">Profile</Text>
        {/* Placeholder avatar */}
        <View style={styles.avatarWrapper} accessible accessibilityLabel="Profile Avatar">
          <Image source={avatar ? { uri: avatar } : require('../../assets/avatar-placeholder.png')} style={styles.avatar} />
        </View>
        <Text style={styles.label} accessibilityLabel="Name">Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          accessibilityLabel="Name input"
        />
        <Text style={styles.label} accessibilityLabel="Email">Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Email input"
        />
        {/* Future: Add avatar upload */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} accessibilityRole="button" accessibilityLabel="Save profile information">
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back to Settings">
          <Text style={styles.backBtnText}>Back to Settings</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginBottom: 32 },
  avatarWrapper: { marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e7ef' },
  label: { fontSize: 16, color: '#64748b', alignSelf: 'flex-start', marginBottom: 6 },
  input: { width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 18, borderWidth: 1, borderColor: '#e5e7eb' },
  saveBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 12 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  backBtn: { backgroundColor: '#e0e7ef', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  backBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
});
