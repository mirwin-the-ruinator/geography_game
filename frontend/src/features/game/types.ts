export type NotificationType = 'email' | 'sms';

export type GameMode = 'single' | 'multi';

export interface Player {
  username: string;
  contact: string;
  notification: NotificationType;
}
