import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { PatientService, PatientResponse } from '../../../../../core/services/patient.service';
import { catchError, of } from 'rxjs';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patientId!: number;
  patient?: PatientResponse;
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPatient();
  }

  /**
   * Récupère les détails du patient
   */
  loadPatient(): void {
    this.isLoading = true;
    this.hasError = false;

    console.log('📡 ID du patient à charger :', this.patientId);

    this.patientService.getPatientById(this.patientId)
      .pipe(
        catchError(err => {
          console.error('❌ Erreur chargement patient depuis le backend :', err);
          this.hasError = true;
          return of(undefined);
        })
      )
      .subscribe((patient: PatientResponse | undefined) => {
        if (!patient) {
          console.warn('⚠️ Aucun patient reçu pour l\'ID', this.patientId);
          this.hasError = true;
          this.isLoading = false;
          return;
        }
        console.log('✅ Patient reçu :', patient);
        this.patient = patient;
        this.isLoading = false;
      });
  }

  goBack(): void {
    history.back(); // ou this.router.navigate(['../'], { relativeTo: this.route });
  }

  onEdit(id: number): void {
    this.router.navigate([`/dashboard/patients/edit`, id])
      .then(success => {
        if (success) {
          console.log(`✅ Navigation réussie vers /dashboard/patients/edit/${id}`);
        } else {
          console.warn('❌ Navigation échouée');
        }
      })
      .catch(error => {
        console.error('❌ Erreur lors de la navigation :', error);
      });
  }


}
