import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStatsComponent } from '../../components/widgets/card-stats/card-stats.component';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '@shared/models/notification.model';
import { RendezVousResponse } from '../../models/rendezvous-response.model';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    CardStatsComponent,
    LucideIconsModule,
    RouterModule
  ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  stats = {
    totalPatients: 0,
    appointmentsToday: 0,
    totalRevenue: 0
  };

  appointmentsToday: RendezVousResponse[] = [];
  notifications: Notification[] = [];

  private http = inject(HttpClient);

  constructor(
    private notificationService: NotificationService,
    private rendezvousService: RendezvousService
  ) {}

  ngOnInit(): void {
    this.loadStatsFromApi();
    this.loadTodayAppointments();
    this.loadRecentNotifications();
  }

  private loadStatsFromApi(): void {
    this.http.get<{ totalPatients: number; appointmentsToday: number; totalRevenue: number }>(
      `${environment.apiUrl}/dashboard/stats`
    ).subscribe({
      next: (res) => this.stats = res,
      error: (err: any) => console.error('Error loading stats dashboard', err)
    });
  }

  private loadTodayAppointments(): void {
    this.http.get<RendezVousResponse[]>(`${environment.apiUrl}/dashboard/today`)
      .subscribe({
        next: (rdvs) => this.appointmentsToday = rdvs.slice(0, 5),
        error: (err: any) => console.error('Error loading todays appointment', err)
      });
  }

  private loadRecentNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(notifs => {
      this.notifications = notifs
        .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())
        .slice(0, 5);
    });
  }

  formatDate(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleDateString('fr-FR') + ' has ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
