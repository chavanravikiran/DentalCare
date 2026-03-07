import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

export const RedirectIfAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return true; // Not logged in → can access login/register
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];

    // Role-based redirection
    if (roles.includes('ROLE_ADMIN')) {
      return router.navigate(['/dashboard']).then(() => false);
    } else if (roles.includes('ROLE_USER')) {
      return router.navigate(['/user-account']).then(() => false);
    } else {
      return router.navigate(['/']).then(() => false);
    }

  } catch (err) {
    console.warn('❌ Invalid or corrupted token', err);
    localStorage.removeItem('authToken');
    return true; // Authorized access
  }
};
