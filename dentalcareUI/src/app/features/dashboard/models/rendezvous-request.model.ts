export interface RendezVousRequest {
  date: string;         // 'YYYY-MM-DD'
  heureDebut: string;   // 'HH:mm'
  heureFin: string;     // 'HH:mm'
  type: 'CONSULTATION' | 'SUIVI' | 'DETARTRAGE' | 'AUTRE';
  motif?: string;
  status?: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE';
}
