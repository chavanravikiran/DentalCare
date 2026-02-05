export interface RendezVousAdminResponse {
  id: number;
  date: string; // format 'YYYY-MM-DD'
  heureDebut: string; // format 'HH:mm:ss'
  heureFin: string;
  type: string;       // Ex: "CONSULTATION", "FOLLOW UP", etc.
  status: string;     // Ex: "ON HOLD", "CONFIRMED", etc.
  motif: string;
  praticien: string;
  patientId: number | null;
  nomPatient: string;
  emailPatient: string;
  patientEnabled: boolean;
  createdByAdmin: boolean;
  version: number;
}
