import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

//Provide a unified API to display visual notifications (snackbars) throughout the application, via Angular Material.
/**
 * Centralized notification service using MatSnackBar
 * Provides practical methods for different types of messages
 */
@Injectable({
  providedIn: 'root' //This service is available throughout your app
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Displays a success notification
   * @param message The message to display
   * @param config Optional configuration
   */
  showSuccess(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Fermer', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Displays an error notification
   * @param message The message to display
   * @param config Optional configuration
   */
  showError(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Displays an error notification
   * @param message The message to display
   * @param config Optional configuration
   */
  showWarning(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['warning-snackbar']
    });
  }

  /**
   * Affiche une notification d'information
   * @param message Le message à afficher
   * @param config Configuration optionnelle
   */
  showInfo(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {//Fermer
      ...this.defaultConfig,
      ...config,
      panelClass: ['info-snackbar']
    });
  }
}
