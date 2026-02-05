import { Routes } from '@angular/router';
import { AuthGuardAdmin } from '../../core/guards/auth-admin.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { RendezvousComponent } from './pages/rendezvous/rendezvous.component';
import {AccueilComponent} from './pages/accueil/accueil.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { PATIENTS_ROUTES } from './pages/patients/patients.routes';
import {NotificationsAdminPageComponent} from './pages/notifications-admin/notifications-admin-page.component';
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardAdmin],
    children: [
      { path: 'accueil', component: AccueilComponent },
      {path: 'patients', children: PATIENTS_ROUTES},
      { path: 'rendezvous', component: RendezvousComponent }, // ajouter un sous-routage lorsqu'on aura des sous routes
      { path: 'notifications', component: NotificationsAdminPageComponent },
      {path: 'messages' , component: MessagesComponent},
      { path: 'statistiques', component: StatistiquesComponent },
      { path: 'parametres', component: ParametresComponent },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      {
        path: 'calendrier',
        loadComponent: () =>
          import('./components/full-calendar/full-calendar.component').then(m => m.FullCalendarComponent)
      },
    ]
  }
];
