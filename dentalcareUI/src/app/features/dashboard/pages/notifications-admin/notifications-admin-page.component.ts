import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardAdminComponent } from '../../components/notification-card-admin/notification-card-admin.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '@shared/models/notification.model';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationCardAdminComponent, MatDialogModule],
  templateUrl: './notifications-admin-page.component.html',
  styleUrls: ['./notifications-admin-page.component.css']
})
export class NotificationsAdminPageComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedStatus: 'SUCCESS' | 'FAILURE' | '' = '';
  selectedType: 'NEW_APPOINTMENT' | 'REMINDER' | '' = '';
  sortOrder: 'asc' | 'desc' = 'desc';

  currentPage: number = 1;
  pageSize: number = 6;

  private wsSub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.fetchNotifications();

    this.wsSub = this.webSocketService.notification$.subscribe((notifResponse) => {
      const notif: Notification = {
        id: notifResponse.id.toString(),
        email: notifResponse.recipientEmail,
        type: this.castType(notifResponse.notificationType),
        status: this.castStatus(notifResponse.status),
        message: notifResponse.message,
        attemptedAt: notifResponse.attemptedAt,
        justReceived: true
      };

      const exists = this.notifications.some(n => n.id === notif.id);
      if (!exists) {
        this.notifications.unshift(notif);
        this.applyFilters();

        setTimeout(() => notif.justReceived = false, 3000);
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération notifications :', err);
        this.snackBar.open('Erreur lors du chargement des notifications.', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredNotifications = this.notifications
      .filter((notif) => {
        const matchesSearch =
          this.searchTerm.trim() === '' ||
          notif.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          notif.type.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesStatus = this.selectedStatus === '' || notif.status === this.selectedStatus;
        const matchesType = this.selectedType === '' || notif.type === this.selectedType;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.attemptedAt).getTime();
        const dateB = new Date(b.attemptedAt).getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

    this.currentPage = 1;
  }


  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.applyFilters();
  }

  get paginatedNotifications(): Notification[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredNotifications.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNotifications.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private castStatus(s: string): 'SUCCESS' | 'FAILURE' {
    return s === 'SUCCESS' || s === 'FAILURE' ? s : 'FAILURE';
  }

  private castType(t: string): 'NEW_APPOINTMENT' | 'REMINDER' {
    return t === 'NEW_APPOINTMENT' || t === 'REMINDER' ? t : 'NEW_APPOINTMENT';
  }

  showNotificationDetail(notification: Notification): void {
    this.snackBar.open(notification.message, 'Fermer', {
      duration: 7000,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
