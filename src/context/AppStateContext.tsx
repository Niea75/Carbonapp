import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  ActivityLog,
  ActivityType,
  FeedItem,
  Quest,
  UserProfile,
} from '../types';
import { ACTIVITY_TEMPLATES, CONSENT_VERSION, DAILY_QUESTS } from '../utils/constants';
import { randomizeQuests } from '../utils/questHelpers';
import { v4 as uuidv4 } from 'uuid';

interface AppStateContextProps {
  userProfile: UserProfile | null;
  consentChecked: boolean;
  activities: ActivityLog[];
  quests: Quest[];
  feed: FeedItem[];
  points: number;
  streak: number;
  saveConsent: (userId: string) => Promise<void>;
  logActivity: (input: { type: ActivityType; note?: string; photoUri?: string }) => void;
  addComment: (feedId: string, author: string, message: string) => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'carbonapp-consent';
const ACTIVITY_STORAGE_KEY = 'carbonapp-activities';

const BASE_POINTS: Record<ActivityType, number> = {
  tumbler: 40,
  commute: 30,
  videoMeeting: 20,
  businessTrip: 60,
};

const ACTIVITY_APPROVAL_REQUIRED: ActivityType[] = ['tumbler'];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [quests, setQuests] = useState<Quest[]>(randomizeQuests(DAILY_QUESTS));
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const bootstrap = async () => {
      const consentString = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (consentString) {
        const storedConsent: UserProfile = JSON.parse(consentString);
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;
        const expired = Date.now() - new Date(storedConsent.consentedAt).getTime() > oneYearMs;
        if (storedConsent.consentVersion !== CONSENT_VERSION || expired) {
          await AsyncStorage.removeItem(CONSENT_STORAGE_KEY);
          setUserProfile(null);
        } else {
          setUserProfile(storedConsent);
        }
      }
      const activityString = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (activityString) {
        const storedActivities: ActivityLog[] = JSON.parse(activityString);
        setActivities(storedActivities);
        rebuildStreak(storedActivities);
      }
      setConsentChecked(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const saveConsent = async (userId: string) => {
    const profile: UserProfile = {
      userId,
      consentedAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    };
    await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(profile));
    setUserProfile(profile);
  };

  const rebuildStreak = (activityLogs: ActivityLog[]) => {
    if (!activityLogs.length) {
      setStreak(0);
      return;
    }
    const today = new Date();
    let streakCounter = 0;

    for (let offset = 0; offset < activityLogs.length; offset++) {
      const checkDay = new Date();
      checkDay.setDate(today.getDate() - offset);
      const hasActivity = activityLogs.some((activity) => {
        const activityDate = new Date(activity.timestamp);
        return (
          activityDate.getFullYear() === checkDay.getFullYear() &&
          activityDate.getMonth() === checkDay.getMonth() &&
          activityDate.getDate() === checkDay.getDate()
        );
      });

      if (hasActivity) {
        streakCounter += 1;
      } else {
        break;
      }
    }

    setStreak(streakCounter);
  };

  const calculateEarnedPoints = (activity: ActivityLog) => {
    return activity.status === 'approved' ? activity.points : 0;
  };

  const totalPoints = useMemo(() => {
    return activities.reduce((acc, activity) => acc + calculateEarnedPoints(activity), 0);
  }, [activities]);

  const updateQuests = (activity: ActivityLog) => {
    setQuests((current) =>
      current.map((quest) => {
        if (quest.isComplete) return quest;
        let progress = quest.progress;
        if (quest.type === 'activityCount') {
          progress += 1;
        }
        if (quest.type === 'pointsEarned') {
          progress += calculateEarnedPoints(activity);
        }
        if (quest.type === 'teamLog') {
          progress += 1; // in real app, would check team participation
        }
        const isComplete = progress >= quest.requirement;
        if (isComplete) {
          setFeed((existing) => [
            {
              id: uuidv4(),
              type: 'quest',
              title: `${quest.title} 달성!`,
              description: quest.description,
              createdAt: new Date().toISOString(),
              comments: [],
            },
            ...existing,
          ]);
        }
        return { ...quest, progress, isComplete };
      })
    );
  };

  const logActivity = (input: { type: ActivityType; note?: string; photoUri?: string }) => {
    const template = ACTIVITY_TEMPLATES.find((item) => item.id === input.type);
    if (!template) return;

    if (template.requiresPhoto && !input.photoUri) {
      Alert.alert('사진 첨부가 필요합니다', '텀블러 사용 인증을 위해 사진을 올려주세요.');
      return;
    }

    const status = ACTIVITY_APPROVAL_REQUIRED.includes(input.type) ? 'pending' : 'approved';
    const activity: ActivityLog = {
      id: uuidv4(),
      type: input.type,
      timestamp: new Date().toISOString(),
      note: input.note,
      photoUri: input.photoUri,
      points: BASE_POINTS[input.type],
      status,
    };

    setActivities((current) => {
      const updated = [activity, ...current];
      rebuildStreak(updated);
      return updated;
    });
    setFeed((current) => [
      {
        id: uuidv4(),
        type: 'activity',
        title: `${template.name} 기록` + (activity.status === 'pending' ? ' (승인 대기)' : ''),
        description: activity.note || '활동 인증 완료',
        createdAt: activity.timestamp,
        comments: [],
      },
      ...current,
    ]);

    if (activity.status === 'approved') {
      updateQuests(activity);
    }
  };

  const addComment = (feedId: string, author: string, message: string) => {
    setFeed((current) =>
      current.map((item) =>
        item.id === feedId
          ? {
              ...item,
              comments: [
                ...item.comments,
                { id: uuidv4(), author, message, createdAt: new Date().toISOString() },
              ],
            }
          : item
      )
    );
  };

  const value = {
    userProfile,
    consentChecked,
    activities,
    quests,
    feed,
    points: totalPoints,
    streak,
    saveConsent,
    logActivity,
    addComment,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
