import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LEAGUE_TEAMS } from '../utils/constants';
import { LeagueTeam } from '../types';

const leagues: { id: LeagueTeam['league']; label: string }[] = [
  { id: 'bronze', label: '브론즈' },
  { id: 'silver', label: '실버' },
  { id: 'gold', label: '골드' },
];

const TeamLeaderboardScreen: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueTeam['league']>('bronze');

  const filtered = useMemo(
    () => LEAGUE_TEAMS.filter((team) => team.league === selectedLeague).sort((a, b) => b.points - a.points),
    [selectedLeague]
  );

  const trendText: Record<LeagueTeam['trend'], string> = {
    promoted: '승급 예정',
    relegated: '강등 위험',
    steady: '잔류',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>리그별 팀 리더보드</Text>
      <Text style={styles.description}>각 리그는 매주 리셋되고 1위는 승급, 3위는 강등됩니다.</Text>
      <View style={styles.segment}>
        {leagues.map((league) => (
          <TouchableOpacity
            key={league.id}
            style={[styles.segmentItem, selectedLeague === league.id && styles.segmentActive]}
            onPress={() => setSelectedLeague(league.id)}
          >
            <Text style={selectedLeague === league.id ? styles.segmentActiveText : styles.segmentText}>
              {league.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.map((team, index) => (
          <View key={team.id} style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.meta}>{trendText[team.trend]}</Text>
            </View>
            <Text style={styles.score}>{team.points}pt</Text>
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 4,
    borderRadius: 999,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 999,
  },
  segmentActive: { backgroundColor: '#16a34a' },
  segmentText: { color: '#374151', fontWeight: '600' },
  segmentActiveText: { color: '#fff', fontWeight: '700' },
  list: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 8 },
  rank: { fontWeight: '800', width: 28 },
  teamName: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#6b7280' },
  score: { fontWeight: '700' },
});

export default TeamLeaderboardScreen;
