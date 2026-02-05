// features/dashboard/pages/patients/patients.routes.ts
import { Routes } from '@angular/router';
import { PatientsPageComponent } from './patients-page/patients-page.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    component: PatientsPageComponent,
    children: [
      { path: '', component: PatientsListComponent },
      { path: 'create', component: PatientFormComponent },
      { path: 'edit/:id', component: PatientFormComponent },
      { path: ':id', component: PatientDetailsComponent },
    ]
  }
];
