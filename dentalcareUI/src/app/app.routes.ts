// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { USER_ACCOUNT_ROUTES } from './features/user-account/user-account.routes';
import { PUBLIC_PAGES_ROUTES } from './features/public-pages/ublic-pages.routes';

export const routes: Routes = [
  {
    path: 'user-account',
    children: USER_ACCOUNT_ROUTES,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  },
  // 📦 Routes publiques (accueil, services, etc.)
  ...PUBLIC_PAGES_ROUTES,
  // 🔐 Auth routes (login/register/activation)
  ...authRoutes,

  // 🚨 Redirection en cas de route inconnue
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
