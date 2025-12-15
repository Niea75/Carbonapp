import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import ActivityScreen from './src/screens/ActivityScreen';
import QuestScreen from './src/screens/QuestScreen';
import TeamLeaderboardScreen from './src/screens/TeamLeaderboardScreen';
import IndividualLeaderboardScreen from './src/screens/IndividualLeaderboardScreen';
import FeedScreen from './src/screens/FeedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ConsentScreen from './src/screens/ConsentScreen';
import { AppStateProvider, useAppState } from './src/context/AppStateContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="활동" component={ActivityScreen} options={{ tabBarIcon: () => <Text>🧭</Text> }} />
    <Tab.Screen name="퀘스트" component={QuestScreen} options={{ tabBarIcon: () => <Text>🎯</Text> }} />
    <Tab.Screen name="팀 리더보드" component={TeamLeaderboardScreen} options={{ tabBarIcon: () => <Text>👥</Text> }} />
    <Tab.Screen
      name="개인 리더보드"
      component={IndividualLeaderboardScreen}
      options={{ tabBarIcon: () => <Text>⭐️</Text> }}
    />
    <Tab.Screen name="피드" component={FeedScreen} options={{ tabBarIcon: () => <Text>📰</Text> }} />
    <Tab.Screen name="설정" component={SettingsScreen} options={{ tabBarIcon: () => <Text>⚙️</Text> }} />
  </Tab.Navigator>
);

const Root = () => {
  const { userProfile, consentChecked } = useAppState();

  if (!consentChecked) {
    return <Text>로딩 중...</Text>;
  }

  if (!userProfile) {
    return <ConsentScreen />;
  }

  return <TabNavigator />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
