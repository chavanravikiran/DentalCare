import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '@shared/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Retrieve all notifications (admin only)
   */
  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}`);
  }

  /**
   * Retrieve notifications from the logged-in user
   */
  getUserNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user`);
  }

  /**
   * Retry sending a notification (optional future option)
   */
  retryNotification(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/retry`, {});
  }
}
