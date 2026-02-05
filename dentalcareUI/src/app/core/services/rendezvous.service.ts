import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, tap} from 'rxjs';
import { RendezVousResponse } from '../../features/dashboard/models/rendezvous-response.model';
import { RendezVousRequest } from '../../features/dashboard/models/rendezvous-request.model';
import {RendezVousAdminResponse} from '../../features/dashboard/models/rendezvous-admin-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {}

  /** GET tous les RDV (ADMIN) */
  getAll(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous`);
  }

  /** 🔍 GET RDV par date */
  getByDate(date: string): Observable<RendezVousResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-date`, { params });
  }
  /** GET tous les RDV d’un mois spécifique (ADMIN ou USER) */
  getByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month`, {
      params: { year, month }
    });
  }

  /** 🔍 Récupérer les RDV d’un mois donné à partir d’une date LocalDate (format 'YYYY-MM-DD') */
  getByMonthDate(date: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month-date`, {
      params: { date }
    });
  }

  /** GET mes RDV (USER connecté) */
  getMyRendezVous(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-user`);
  }

  /** POST nouveau RDV */
  createRendezVous(data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.post<RendezVousResponse>(`${this.api}/rendezvous`, data);
  }
  /** ✅ Confirmer un RDV */
  confirmRendezVous(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/rendezvous/${id}/confirm`, {});
  }

  /** ⚠️ Rejeter un RDV */
  rejectRendezVous(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/rendezvous/${id}/reject`, {});
  }


  /** DELETE RDV par ID (ADMIN) */
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/rendezvous/${id}`);
  }
  /** ✏️ PUT modifier un RDV */
  updateRendezVous(id: number, data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.put<RendezVousResponse>(`${this.api}/rendezvous/${id}`, data);
  }

  /** 🌍 GET RDV publics confirmés (affichage calendrier public) */
  getPublicByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/public/by-month`, {
      params: { year, month }
    });
  }

  /** 🧠 GET RDV enrichis (admin, avec infos patient/user) */
  getAllAdminByMonth(year: number, month: number): Observable<RendezVousAdminResponse[]> {
    return this.http.get<RendezVousAdminResponse[]>(`${this.api}/rendezvous/admin/by-month`, {
      params: { year, month }
    });
  }

  /** 🔍 GET RDV par statut (EN_ATTENTE, CONFIRME, ANNULE...) */
  getByStatus(status: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-status`, {
      params: { status }
    });
  }
  /** 📄 GET RDV par ID */
  getById(id: number): Observable<RendezVousResponse> {
    return this.http.get<RendezVousResponse>(`${this.api}/rendezvous/${id}`);
  }
  /**
   * 🧠 Crée un RDV avec gestion d'erreur UX via toast
   */
  createRendezVousSafe(data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.post<RendezVousResponse>(`${this.api}/rendezvous`, data).pipe(
      tap(() => {
        this.snackBar.open('✅ Rendez-vous confirmé avec succès.', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.snackBar.open('⛔ Ce créneau est déjà réservé. Merci de choisir un autre.', 'Fermer', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        } else {
          this.snackBar.open('❌ Une erreur est survenue lors de la création.', 'Fermer', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
        throw error; // laisse passer l'erreur au composant si besoin
      })
    );
  }
  searchRdvByDate(date: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/search/date`, {
      params: { date }
    });
  }
  searchRdvByNameOrEmail(query: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/search`, {
      params: { query }
    });
  }

  searchAdminRdvByNameOrEmail(query: string): Observable<RendezVousAdminResponse[]> {
    return this.http.get<RendezVousAdminResponse[]>(`${this.api}/rendezvous/admin/search`, {
      params: { query }
    });
  }

  searchAdminRdvByDate(date: string): Observable<RendezVousAdminResponse[]> {
    return this.http.get<RendezVousAdminResponse[]>(`${this.api}/rendezvous/admin/search/date`, {
      params: { date }
    });
  }

}
