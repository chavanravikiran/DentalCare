import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

export const RedirectIfAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return true; // Pas connecté → peut accéder à login/register
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];

    // Redirection en fonction du rôle
    if (roles.includes('ROLE_ADMIN')) {
      return router.navigate(['/dashboard']).then(() => false);
    } else if (roles.includes('ROLE_USER')) {
      return router.navigate(['/user-account']).then(() => false);
    } else {
      return router.navigate(['/']).then(() => false);
    }

  } catch (err) {
    console.warn('❌ Token invalide ou corrompu', err);
    localStorage.removeItem('authToken');
    return true; // Accès autorisé
  }
};
