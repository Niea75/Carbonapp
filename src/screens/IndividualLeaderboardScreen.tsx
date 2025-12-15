import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';

const mockIndividuals = [
  { id: 'you', name: '나', points: 0, streak: 0 },
  { id: 'ally', name: '김에코', points: 240, streak: 5 },
  { id: 'lee', name: '이탄소', points: 180, streak: 4 },
  { id: 'park', name: '박제로', points: 160, streak: 6 },
];

const IndividualLeaderboardScreen: React.FC = () => {
  const { points, streak } = useAppState();
  const leaderboard = mockIndividuals.map((person) =>
    person.id === 'you' ? { ...person, points, streak } : person
  ).sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>개인 리더보드</Text>
      <Text style={styles.description}>개인별 누적 포인트와 연속 활동일을 보여줍니다.</Text>
      <View style={styles.list}>
        {leaderboard.map((person, index) => (
          <View key={person.id} style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.meta}>연속 {person.streak}일 • {person.points} pt</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700' },
  description: { color: '#6b7280' },
  list: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10 },
  rank: { fontWeight: '800', width: 28 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#6b7280' },
});

export default IndividualLeaderboardScreen;
