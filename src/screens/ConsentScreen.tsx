import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';

const ConsentScreen: React.FC = () => {
  const { saveConsent } = useAppState();
  const [userId, setUserId] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    if (!userId) return;
    if (!accepted) return;
    await saveConsent(userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>탄소저감 활동에 참여하려면 동의가 필요해요</Text>
      <Text style={styles.description}>
        · 최초 1회 및 매년 동의가 필요합니다.{'\n'}· 활동 기록, 리더보드, 피드를 위해 사용자 정보를 저장합니다.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="사번 또는 이메일"
        value={userId}
        onChangeText={setUserId}
      />
      <View style={styles.checkboxRow}>
        <Button title={accepted ? '✅ 동의완료' : '⬜️ 동의'} onPress={() => setAccepted((v) => !v)} />
        <Text style={styles.checkboxLabel}>개인정보 수집·이용에 동의합니다.</Text>
      </View>
      <Button title="시작하기" onPress={handleAccept} disabled={!userId || !accepted} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#f7faf7',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#4b5563',
    lineHeight: 20,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
});

export default ConsentScreen;
