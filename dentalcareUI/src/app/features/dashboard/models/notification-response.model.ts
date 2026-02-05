export interface NotificationResponse {
  id: number;
  recipientEmail: string;
  notificationType: string; // ex: "APPOINTMENT_CONFIRMATION", "REMINDER", etc.
  status: string;           // ex: "SUCCES", "Failure"
  message: string;
  attemptedAt: string;      // LocalDateTime → ISO string

}
