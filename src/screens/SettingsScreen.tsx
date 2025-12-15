import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSENT_VERSION } from '../utils/constants';

const SettingsScreen: React.FC = () => {
  const { userProfile, saveConsent } = useAppState();

  const resetConsent = async () => {
    await AsyncStorage.removeItem('carbonapp-consent');
    if (userProfile) {
      await saveConsent(userProfile.userId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>설정</Text>
      <View style={styles.card}>
        <Text style={styles.label}>사용자</Text>
        <Text style={styles.value}>{userProfile?.userId || '미인증'}</Text>
        <Text style={styles.meta}>동의 버전: {CONSENT_VERSION}</Text>
        <Button title="동의 다시 받기" onPress={resetConsent} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>보안 & 데이터</Text>
        <Text style={styles.meta}>동의 시점 기준 1년 후 재동의가 필요합니다.</Text>
        <Text style={styles.meta}>활동 기록과 피드는 기기에 로컬 저장되어 오프라인에서도 확인 가능합니다.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  label: { fontSize: 16, fontWeight: '700' },
  value: { fontSize: 18, fontWeight: '800' },
  meta: { color: '#6b7280' },
});

export default SettingsScreen;
