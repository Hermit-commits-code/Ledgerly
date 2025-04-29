import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getTransactions, storeTransaction } from '../utils/storage';

export default function DataExportImportScreen() {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    setLoading(true);
    try {
      const txs = await getTransactions();
      const csv = toCSV(txs);
      const fileUri = FileSystem.documentDirectory + 'ledgerly-export.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri);
    } catch (e) {
      Alert.alert('Export failed', e.message);
    }
    setLoading(false);
  };

  const importData = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
        const txs = fromCSV(content);
        for (let t of txs) {
          await storeTransaction(t);
        }
        Alert.alert('Import complete', `${txs.length} transactions imported.`);
      }
    } catch (e) {
      Alert.alert('Import failed', e.message);
    }
    setLoading(false);
  };

  const backupToFile = async () => {
    try {
      const txs = await getTransactions();
      const json = JSON.stringify(txs, null, 2);
      const fileUri = FileSystem.documentDirectory + 'ledgerly-backup.json';
      await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri);
    } catch (e) {
      Alert.alert('Backup failed', e.message);
    }
  };

  const restoreFromFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
        const txs = JSON.parse(content);
        if (!Array.isArray(txs)) throw new Error('Invalid backup file');
        for (let t of txs) {
          await storeTransaction(t);
        }
        Alert.alert('Restore complete', `${txs.length} transactions restored.`);
      }
    } catch (e) {
      Alert.alert('Restore failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Data Export / Import</Text>
        <TouchableOpacity style={styles.btn} onPress={exportData} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Exporting...' : 'Export Transactions (CSV)'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={importData} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Importing...' : 'Import Transactions (CSV)'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={backupToFile} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Backing up...' : 'Backup to File (JSON)'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={restoreFromFile} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Restoring...' : 'Restore from File (JSON)'}</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Export creates a CSV file you can save or share. Import lets you select a CSV file to add transactions.</Text>
      </View>
    </SafeAreaView>
  );
}

function toCSV(txs) {
  if (!txs.length) return '';
  const fields = Object.keys(txs[0]);
  const rows = [fields.join(',')];
  for (let t of txs) {
    rows.push(fields.map(f => JSON.stringify(t[f] ?? '')).join(','));
  }
  return rows.join('\n');
}

function fromCSV(csv) {
  const [header, ...lines] = csv.split('\n');
  const fields = header.split(',');
  return lines.filter(Boolean).map(line => {
    const vals = line.split(',').map(s => s.replace(/^"|"$/g, ''));
    const obj = {};
    fields.forEach((f, i) => obj[f] = vals[i]);
    obj.amount = Number(obj.amount);
    return obj;
  });
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  btn: { backgroundColor: '#38bdf8', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 18 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  note: { color: '#64748b', marginTop: 20, fontSize: 14 },
});
