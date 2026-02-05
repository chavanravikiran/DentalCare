import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendezvousService } from '../../../core/services/rendezvous.service';
import { PatientService, PatientResponse } from '../../../core/services/patient.service';
import { RendezVousResponse } from '../../dashboard/models/rendezvous-response.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  private rdvService = inject(RendezvousService);
  private patientService = inject(PatientService);

  isLoading = true;
  confirmedRDVs: RendezVousResponse[] = [];
  patient?: PatientResponse;

  ngOnInit(): void {
    this.fetchPatientAndRendezVous();
  }

  fetchPatientAndRendezVous(): void {
    this.isLoading = true;

    this.patientService.getCurrentPatient().subscribe({
      next: (patientData) => {
        this.patient = patientData;

        this.rdvService.getMyRendezVous().subscribe({
          next: (rdvs) => {
            const today = new Date().toISOString().split('T')[0];
            this.confirmedRDVs = rdvs.filter(rdv =>
              rdv.status === 'CONFIRME' && rdv.date >= today
            );
            this.isLoading = false;
          },
          error: () => {
            console.error("❌ Error loading appointments");
            this.isLoading = false;
          }
        });
      },
      error: () => {
        console.error("❌ Error loading patient");
        this.isLoading = false;
      }
    });
  }
}
