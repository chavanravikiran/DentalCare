// ✅ src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { RedirectIfAuthenticatedGuard } from '../../core/guards/redirect-if-auth.guard';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then(m => m.LoginComponent),
        canActivate: [RedirectIfAuthenticatedGuard]
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then(m => m.RegisterComponent),
        canActivate: [RedirectIfAuthenticatedGuard]
      },
      {
        path: 'activate-account',
        loadComponent: () =>
          import('./activation-account/activate-account.component').then(
            m => m.ActivateAccountComponent
          ),
        canActivate: [RedirectIfAuthenticatedGuard]
      }
      // 🔧 Ajouter d'autres routes auth ici plus tard (mot de passe oublié, etc.)
    ]
  }
];
