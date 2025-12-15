import { ActivityTemplate, LeagueTeam, Quest } from '../types';

export const CONSENT_VERSION = '2024.08';

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: 'tumbler',
    name: '텀블러 사용',
    icon: '🥤',
    description: '일회용컵 대신 텀블러 사용',
    requiresPhoto: true,
    metadataFields: ['장소'],
  },
  {
    id: 'commute',
    name: '출퇴근(대중교통/도보/자전거)',
    icon: '🚲',
    description: '친환경 출퇴근 수단 이용',
    metadataFields: ['이동수단', '거리'],
  },
  {
    id: 'videoMeeting',
    name: '화상회의',
    icon: '💻',
    description: '대면 회의 대신 화상회의 진행',
    metadataFields: ['회의명'],
  },
  {
    id: 'businessTrip',
    name: '출장 대체',
    icon: '✈️',
    description: '출장을 줄이거나 대체한 경우',
    metadataFields: ['목적지'],
  },
];

export const DAILY_QUESTS: Quest[] = [
  {
    id: 'team-once',
    title: '전 팀원 활동기록 1회 남기기',
    description: '팀원들과 함께 최소 1회 활동 인증',
    requirement: 1,
    progress: 0,
    isComplete: false,
    type: 'teamLog',
  },
  {
    id: 'three-activities',
    title: '활동기록 3개 이상 하기',
    description: '오늘 3회 이상 활동을 남기기',
    requirement: 3,
    progress: 0,
    isComplete: false,
    type: 'activityCount',
  },
  {
    id: 'hundred-points',
    title: '활동기록에서 100Point 이상 얻기',
    description: '오늘 100 포인트 이상 적립',
    requirement: 100,
    progress: 0,
    isComplete: false,
    type: 'pointsEarned',
  },
];

export const LEAGUE_TEAMS: LeagueTeam[] = [
  { id: 'bronze-1', name: '그린버드', league: 'bronze', points: 120, trend: 'promoted' },
  { id: 'bronze-2', name: '탄소제로', league: 'bronze', points: 110, trend: 'steady' },
  { id: 'bronze-3', name: '에코러너', league: 'bronze', points: 90, trend: 'relegated' },
  { id: 'silver-1', name: '클린웨이브', league: 'silver', points: 200, trend: 'promoted' },
  { id: 'silver-2', name: '햇살한스푼', league: 'silver', points: 180, trend: 'steady' },
  { id: 'silver-3', name: '에너지세이버', league: 'silver', points: 140, trend: 'relegated' },
  { id: 'gold-1', name: '제로히어로', league: 'gold', points: 320, trend: 'steady' },
  { id: 'gold-2', name: '블루스카이', league: 'gold', points: 300, trend: 'steady' },
  { id: 'gold-3', name: '그린코어', league: 'gold', points: 260, trend: 'steady' },
];
