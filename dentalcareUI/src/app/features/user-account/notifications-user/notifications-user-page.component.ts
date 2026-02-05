import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardUserComponent } from '../components/notification-card-user/notification-card-user.component';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '@shared/models/notification.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-user-page',
  standalone: true,
  imports: [CommonModule, NotificationCardUserComponent],
  templateUrl: './notifications-user-page.component.html',
  styleUrls: ['./notifications-user-page.component.css']
})
export class NotificationsUserPageComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading: boolean = true;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUserNotifications();
  }

  fetchUserNotifications(): void {
    this.isLoading = true;
    this.notificationService.getUserNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error recovery user notifications :', err);
        this.snackBar.open('Error loading your notifications.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
