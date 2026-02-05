import { Component, Input } from '@angular/core';
import { Notification } from '@shared/models/notification.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-notification-card-admin',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './notification-card-admin.component.html',
  styleUrls: ['./notification-card-admin.component.css'],
})
export class NotificationCardAdminComponent {
  @Input() notification!: Notification;

  constructor(private snackBar: MatSnackBar) {}

  showFullMessage(): void {
    this.snackBar.open(this.notification.message, 'Fermer', {
      duration: 7000,
      panelClass: 'snackbar-custom',
      verticalPosition: 'bottom',
    });
  }

  getStatusClasses(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILURE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getTypeBadgeClasses(): string {
    switch (this.notification.type) {
      case 'NEW_APPOINTMENT':
        return 'bg-blue-100 text-blue-600';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusIcon(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'check-circle';
      case 'FAILURE':
        return 'x-circle';
      default:
        return 'alert-circle';
    }
  }

  formatType(type: string): string {
    switch (type) {
      case 'NEW_APPOINTMENT': return 'New appointment';
      case 'REMINDER': return 'Reminder';
      default: return type;
    }
  }

  formatDateTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
