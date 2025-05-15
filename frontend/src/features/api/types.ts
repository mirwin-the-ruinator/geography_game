import { NotificationType } from '../game/types';

export interface SignupRequest {
  username: string;
  contact: string;
  notification: NotificationType;
}

export interface UserSummaryResponse {
  username: string;
  completedGames: number;
  accuracyRate: number;
  winRate: number;
  longestStreak: number;
  regionAccuracy: Record<string, number>;
}

export interface LoginRequest {
  username: string;
  contact: string;
  notification: NotificationType;
}
