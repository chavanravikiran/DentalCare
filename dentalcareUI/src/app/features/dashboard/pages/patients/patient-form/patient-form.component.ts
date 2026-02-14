import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService, PatientResponse } from '../../../../../core/services/patient.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideIconsModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isEditMode = false;
  patientId?: number;
  @Output() created = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.patientId;

    if (this.isEditMode) {
      this.loadPatient();
    } else {
      this.initForm();
    }
  }
  initForm(patient?: PatientResponse): void {
    this.patientForm = this.fb.group({
      nom: [patient?.nom || '', Validators.required],
      prenom: [patient?.prenom || '', Validators.required],
      email: [patient?.email || '', [Validators.required, Validators.email]],
      cin: [patient?.cin || '', Validators.required],
      genre: [patient?.genre || ''],
      dateNaissance: [patient?.dateNaissance || ''],
      adresse: [patient?.adresse || ''],
      enabled: [patient?.enabled ?? true]
    });
  }
  loadPatient(): void {
    this.patientService.getPatientById(this.patientId!).subscribe({
      next: (patient) => this.initForm(patient),
      error: (err) => {
        console.error('❌ Patient loading error :', err);
        this.errorMessage = 'Unable to load patient data.';
      }
    });
  }

  /**
   * 🔼 Submits the form if valid and sends the data to the backend
   */
  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.patientForm.value;
    const request$ = this.isEditMode
      ? this.patientService.updatePatient(this.patientId!, payload)
      : this.patientService.createPatient(payload);
    request$.subscribe({
      next: (res) => {
        this.successMessage = this.isEditMode
          ? '✅ Patient mis à jour avec succès.'
          : `✅ Patient ${res.prenom} ${res.nom} added successfully.`;
        this.isSubmitting = false;
        this.created.emit();

        if (!this.isEditMode) {
          this.patientForm.reset({
            nom: '',
            prenom: '',
            email: '',
            cin: '',
            genre: '',
            dateNaissance: '',
            adresse: '',
            enabled: true
          });
        }
      },
      error: (error) => {
        this.errorMessage = '❌ An error occurred while registering the patient.';
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
  goBack(): void {
    history.back(); // or else this.router.navigate(['/dashboard/patients']);
  }

}
