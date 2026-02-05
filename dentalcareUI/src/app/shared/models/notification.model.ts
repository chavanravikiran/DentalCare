export interface Notification {
  id: string;
  email: string;
  type: 'NEW_APPOINTMENT' | 'REMINDER';
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  attemptedAt: string; // Date ISO au format backend
  justReceived?: boolean;
}
