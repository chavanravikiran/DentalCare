// src/app/features/public-pages/public-pages.routes.ts

import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';
import { HomePageComponent } from '../home/home-page/home-page.component';

export const PUBLIC_PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent // 🏠 Page d’accueil
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./calendar-public/calendar-public.component').then(m => m.CalendarPublicComponent)
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/contact.component').then(m => m.ContactComponent)
      }
    ]
  }
];
