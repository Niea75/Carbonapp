import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';

const QuestScreen: React.FC = () => {
  const { quests } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>오늘의 자동 퀘스트</Text>
      <Text style={styles.subtitle}>활동기록에서 자동으로 집계되어 최대 3개가 활성화됩니다.</Text>
      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const ratio = Math.min(item.progress / item.requirement, 1);
          return (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.progressBar}> 
                <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
              </View>
              <Text style={styles.progressLabel}>
                {item.progress} / {item.requirement} {item.isComplete ? '달성!' : ''}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb', gap: 8 },
  header: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: '700' },
  description: { color: '#6b7280' },
  progressBar: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  progressLabel: { fontWeight: '600', marginTop: 4 },
});

export default QuestScreen;
