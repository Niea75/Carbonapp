export type ActivityType = 'tumbler' | 'commute' | 'videoMeeting' | 'businessTrip';

export interface ActivityTemplate {
  id: ActivityType;
  name: string;
  icon: string;
  description: string;
  requiresPhoto?: boolean;
  metadataFields?: string[];
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  timestamp: string;
  points: number;
  note?: string;
  photoUri?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requirement: number;
  progress: number;
  isComplete: boolean;
  type: 'teamLog' | 'activityCount' | 'pointsEarned';
}

export interface FeedComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: 'activity' | 'quest';
  title: string;
  description: string;
  createdAt: string;
  comments: FeedComment[];
}

export interface LeagueTeam {
  id: string;
  name: string;
  league: 'bronze' | 'silver' | 'gold';
  points: number;
  trend: 'promoted' | 'relegated' | 'steady';
}

export interface UserProfile {
  userId: string;
  consentedAt: string;
  consentVersion: string;
}
