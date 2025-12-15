import React, { useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { ACTIVITY_TEMPLATES } from '../utils/constants';
import { ActivityTemplate } from '../types';

const ActivityScreen: React.FC = () => {
  const { activities, logActivity } = useAppState();
  const [selected, setSelected] = useState<ActivityTemplate | null>(null);
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  const handleSubmit = () => {
    if (!selected) return;
    logActivity({ type: selected.id, note, photoUri });
    setSelected(null);
    setNote('');
    setPhotoUri('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>활동을 선택해 인증하세요</Text>
      <FlatList
        data={ACTIVITY_TEMPLATES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subHeader}>최근 활동</Text>
      <View style={styles.logList}>
        {activities.slice(0, 5).map((activity) => (
          <View key={activity.id} style={styles.logItem}>
            <Text style={styles.logTitle}>
              {ACTIVITY_TEMPLATES.find((t) => t.id === activity.type)?.name || activity.type}
            </Text>
            <Text style={styles.logMeta}>
              {new Date(activity.timestamp).toLocaleString()} · {activity.points}pt · {activity.status}
            </Text>
          </View>
        ))}
      </View>

      <Modal visible={!!selected} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selected?.name} 기록하기</Text>
          <Text style={styles.cardSubtitle}>{selected?.description}</Text>
          {selected?.requiresPhoto && <Text style={styles.requirement}>사진 첨부 필수 (관리자 승인 후 적립)</Text>}
          <TextInput
            placeholder="메모"
            style={styles.input}
            value={note}
            onChangeText={setNote}
            multiline
          />
          {selected?.requiresPhoto && (
            <TextInput
              placeholder="사진 URL 또는 경로"
              style={styles.input}
              value={photoUri}
              onChangeText={setPhotoUri}
            />
          )}
          <Button title="활동 기록하기" onPress={handleSubmit} />
          <Button title="닫기" onPress={() => setSelected(null)} color="#6b7280" />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb', gap: 12 },
  header: { fontSize: 22, fontWeight: '700' },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  icon: { fontSize: 28 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#6b7280' },
  logList: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 8 },
  logItem: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 8 },
  logTitle: { fontSize: 15, fontWeight: '600' },
  logMeta: { color: '#6b7280', marginTop: 4 },
  modalContainer: { flex: 1, padding: 24, gap: 12, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  requirement: { color: '#dc2626', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
  },
});

export default ActivityScreen;
