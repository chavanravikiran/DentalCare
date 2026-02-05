// src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  success(message: string): void {
    alert('✅ ' + message);
  }

  error(message: string): void {
    alert('❌ ' + message);
  }

  warning(message: string): void {
    alert('⚠️ ' + message);
  }

  info(message: string): void {
    alert('ℹ️ ' + message);
  }
}
