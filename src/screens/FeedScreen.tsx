import React, { useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';

const FeedScreen: React.FC = () => {
  const { feed, addComment } = useAppState();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleComment = (id: string) => {
    const message = drafts[id];
    if (!message) return;
    addComment(id, '나', message);
    setDrafts((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>활동 & 퀘스트 피드</Text>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.commentSection}>
              {item.comments.map((comment) => (
                <View key={comment.id} style={styles.commentRow}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentText}>{comment.message}</Text>
                </View>
              ))}
              <TextInput
                placeholder="댓글 남기기"
                style={styles.input}
                value={drafts[item.id] || ''}
                onChangeText={(text) => setDrafts((prev) => ({ ...prev, [item.id]: text }))}
              />
              <Button title="등록" onPress={() => handleComment(item.id)} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#6b7280' },
  description: { color: '#374151' },
  commentSection: { gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  commentRow: { flexDirection: 'row', gap: 8 },
  commentAuthor: { fontWeight: '700' },
  commentText: { color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
  },
});

export default FeedScreen;
