import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { PatientService, PatientResponse } from '../../../../../core/services/patient.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconsModule,
    FormsModule
  ],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: PatientResponse[] = [];
  isLoading = true;
  hasError = false;
  totalPatients = 0;
  currentPage = 0;
  pageSize = 10;

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private patientService: PatientService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  filters = {
    nom: '',
    createdByAdmin: undefined as boolean | undefined,
    enabled: undefined as boolean | undefined
  };

  ngOnInit(): void {
    this.loadPatients();

    // 🔁 Déclenche la recherche dynamique après un délai
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.filters.nom = term;
      this.currentPage = 0;
      this.loadPatients();
    });
  }
  onSearchChange(): void {
    this.searchSubject.next(this.filters.nom);
  }

  onEdit(id: number): void {
    this.router.navigate([`/dashboard/patients/edit`, id])
      .then(success => {
        if (success) {
          console.log(`✅ Navigation vers /dashboard/patients/edit/${id} réussie`);
        } else {
          console.warn('❌ Navigation échouée');
        }
      })
      .catch(error => {
        console.error('❌ Erreur lors de la navigation :', error);
      });
  }

  onView(id: number): void {
    void this.router.navigate([`/dashboard/patients/${id}`]);
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      } as ConfirmationDialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.patientService.deletePatient(id).subscribe({
          next: () => {
            console.log(`✅ Patient ID ${id} supprimé`);
            this.loadPatients();
          },
          error: (err) => {
            console.error(' Erreur lors de la suppression :', err);
          }
        });
      }
    });
  }

  trackById(index: number, patient: PatientResponse): number {
    return patient.id;
  }

  loadPatients(): void {
    this.isLoading = true;
    this.hasError = false;

    this.patientService.getPaginatedPatients(this.currentPage, this.pageSize, this.filters)
      .pipe(
        catchError(err => {
          console.error('❌ Erreur chargement patients :', err);
          this.patients = [];
          this.totalPatients = 0;
          this.hasError = true;
          return of({
            patients: [],
            page: {
              totalElements: 0,
              totalPages: 0,
              number: 0,
              size: this.pageSize
            }
          });
        })
      )
      .subscribe(({ patients, page }) => {
        this.patients = patients;
        this.totalPatients = page.totalElements;
        this.currentPage = page.number;
        this.pageSize = page.size;
        this.isLoading = false;
      });
  }
}
