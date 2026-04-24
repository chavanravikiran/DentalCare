export interface RendezVousRequest {
  date: string;         // 'YYYY-MM-DD'
  heureDebut: string;   // 'HH:mm'
  heureFin: string;     // 'HH:mm'
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'DESCALING' | 'OTHER';
  motif?: string;
  status?: 'ON_HOLD' | 'CONFIRME' | 'CANCELED';
  slotId?: number;
  doctorId?: number;
}
