import { Component, OnInit } from '@angular/core';
import { PatientService, PatientResponse } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  patient?: PatientResponse;
  isLoading = true;

  constructor(
    private patientService: PatientService,
    private authService: AuthService // ✅ Injection here
  ) {}

  ngOnInit(): void {
    const userEmail = this.authService.getEmail();
    if (userEmail) {
      this.patientService.getPatientByEmail(userEmail).subscribe({
        next: (data) => {
          this.patient = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          alert("Error loading profile.");
        }
      });
    } else {
      alert("Utilisateur non authentifié.");
    }
  }




}
