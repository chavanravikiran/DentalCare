
import { Component, Input } from '@angular/core';
import { Notification } from '@shared/models/notification.model';
import { CommonModule } from '@angular/common';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-notification-card-user',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './notification-card-user.component.html',
  styleUrls: ['./notification-card-user.component.css'],
})
export class NotificationCardUserComponent {
  @Input() notification!: Notification;

  // Returns the CSS class for the status (success/failure/other)
  getStatusClasses(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILURE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  // Returns the Lucid icon corresponding to the status
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

  // Format the attempt date
  formatDate(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleDateString('fr-FR');
  }

  // Format the attempt time
  formatTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
