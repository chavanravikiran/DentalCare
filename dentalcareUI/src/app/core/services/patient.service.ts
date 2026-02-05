import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import {map, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

/** 🎯 Représente un patient côté frontend */
export interface PatientResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  genre?: string;
  dateNaissance?: string; // LocalDate est automatiquement serialisé en string (format ISO)
  adresse?: string;
  enabled: boolean;
  createdByAdmin: boolean;
  dateDesactivation?: string;
  userId?: number;
}


/** 📦 Structure de réponse paginée depuis le backend */
export interface PagedModel<T> {
  _embedded: {
    patientResponseList: T[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private baseUrl = `${this.API_URL}/patients`;

  constructor() {}

  /**
   * ✅ Crée un nouveau patient (admin uniquement)
   */
  createPatient(payload: {
    nom: string;
    prenom: string;
    email: string;
    cin: string;
    genre?: string;
    dateNaissance?: string;
    adresse?: string;
    enabled?: boolean;
    userId?: number; // optionnel
  }): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(this.baseUrl, payload);
  }

  /**
   * 🔄 Récupère tous les patients (non paginée - legacy)
   */
  getAllPatients(): Observable<PatientResponse[]> {
    return this.http.get<PatientResponse[]>(this.baseUrl);
  }
  getPatientById(id: number): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/${id}`);
  }


  /**
   * 🔁 Récupère les patients de manière paginée + filtrée
   */
  getPaginatedPatients(
    page = 0,
    size = 10,
    filters?: { nom?: string; createdByAdmin?: boolean; enabled?: boolean }
  ): Observable<{
    patients: PatientResponse[];
    page: {
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    };
  }> {
    const params: any = { page, size };
    if (filters?.nom) params.nom = filters.nom;
    if (filters?.createdByAdmin !== undefined) params.createdByAdmin = filters.createdByAdmin;
    if (filters?.enabled !== undefined) params.enabled = filters.enabled;

    return this.http.get<PagedModel<PatientResponse>>(`${this.baseUrl}/paginated`, { params }).pipe(
      map(response => ({
        patients: response._embedded?.patientResponseList || [],
        page: response.page
      }))
    );
  }



  /* Update des patients depuis backend */
  updatePatient(id: number, payload: any): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getPatientByEmail(email: string): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/email`, { params: { email } });
  }

  /** 🔐 Récupère les informations du patient connecté */
  getCurrentPatient(): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/me`);
  }


}
