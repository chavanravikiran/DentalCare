import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import {map, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

/** 🎯 Represents a patient on the frontend */
export interface PatientResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  genre?: string;
  dateNaissance?: string; // LocalDate is automatically serialized as a string (ISO format).
  adresse?: string;
  enabled: boolean;
  createdByAdmin: boolean;
  dateDesactivation?: string;
  userId?: number;
}


/** 📦 Paginated response structure from the backend */
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
   * ✅ Create a new patient (admin only)
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
    userId?: number; // optional
  }): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(this.baseUrl, payload);
  }

  /**
   * 🔄 Retrieves all patients (unpaginated - legacy)
   */
  getAllPatients(): Observable<PatientResponse[]> {
    return this.http.get<PatientResponse[]>(this.baseUrl);
  }
  getPatientById(id: number): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/${id}`);
  }


  /**
   * 🔁 Retrieves patients in a paginated and filtered format.
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



  /* Update patients from backend */
  updatePatient(id: number, payload: any): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getPatientByEmail(email: string): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/email`, { params: { email } });
  }

  /** 🔐 Retrieves information from the connected patient */
  getCurrentPatient(): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.baseUrl}/me`);
  }


}
