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
  private apiUrl = `${environment.apiUrl}/rendezvous`;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {}

  /** GET all appointments (ADMIN) */
  getAll(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous`);
  }

  /** 🔍 GET appointments by date */
  getByDate(date: string): Observable<RendezVousResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-date`, { params });
  }
  /** GET all appointments for a specific month (ADMIN or USER) */
  getByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month`, {
      params: { year, month }
    });
  }

  /** 🔍 Retrieve appointments for a given month from a LocalDate date (format 'YYYY-MM-DD') */
  getByMonthDate(date: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month-date`, {
      params: { date }
    });
  }

  /** GET my appointments (USER logged in) */
  getMyRendezVous(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-user`);
  }

  /** New appointments posted */
  createRendezVous(data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.post<RendezVousResponse>(`${this.api}/rendezvous`, data);
  }
  /** ✅ Confirm an appointment */
  confirmRendezVous(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/rendezvous/${id}/confirm`, {});
  }

  /** ⚠️ Reject an appointment */
  rejectRendezVous(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/rendezvous/${id}/reject`, {});
  }


  /** DELETE appointments by ID (ADMIN) */
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/rendezvous/${id}`);
  }
  /** ✏️ PUT modify an appointment */
  updateRendezVous(id: number, data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.put<RendezVousResponse>(`${this.api}/rendezvous/${id}`, data);
  }

  /** 🌍 GET confirmed public appointments (public calendar display) */
  getPublicByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/public/by-month`, {
      params: { year, month }
    });
  }

  /** 🧠 Enhanced GET appointments (admin, with patient/user information) */
  getAllAdminByMonth(year: number, month: number): Observable<RendezVousAdminResponse[]> {
    return this.http.get<RendezVousAdminResponse[]>(`${this.api}/rendezvous/admin/by-month`, {
      params: { year, month }
    });
  }

  /** 🔍 GET appointments by status (PENDING, CONFIRMED, CANCELLED...) */
  getByStatus(status: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-status`, {
      params: { status }
    });
  }
  /** 📄 GET appointments by ID */
  getById(id: number): Observable<RendezVousResponse> {
    return this.http.get<RendezVousResponse>(`${this.api}/rendezvous/${id}`);
  }
  /**
   * 🧠 Create an appointment with UX error handling via Toast
   */
  createRendezVousSafe(data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.post<RendezVousResponse>(`${this.api}/rendezvous`, data).pipe(
      tap(() => {
        this.snackBar.open('✅ Appointment successfully confirmed.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.snackBar.open('⛔ This time slot is already booked. Please choose another one.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        } else {
          this.snackBar.open('❌ An error occurred during creation.', 'Close', {
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

cancelAppointment(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
}

rescheduleAppointment(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/${id}/reschedule`, data);
}
}
