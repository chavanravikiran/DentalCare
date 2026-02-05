// src/app/features/auth/activate-account/activate-account.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.component.html',
})
export class ActivateAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token: string = '';
  message: string = '';
  isError = false;
  isLoading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const receivedToken = params['token'];
      if (receivedToken) {
        this.token = receivedToken;
        this.activate();
      } else {
        this.message = '❌ No activation code provided.';
        this.isError = true;
      }
    });
  }

  activate(): void {
    if (!/^\d{6}$/.test(this.token)) {
      this.message = '❌ Invalid code. The code must contain 6 digits.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.authService.activateAccount(this.token).subscribe({
      next: () => {
        this.isLoading = false;
        this.isError = false;
        this.message = '✅ Account successfully activated. Redirection in progress...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message =
          err?.error?.message?.includes('expired')
            ? '⏳ Code expired. A new code has been sent to you by email.'
            : '❌ Invalid or already used code.';
      },
    });
  }
}
