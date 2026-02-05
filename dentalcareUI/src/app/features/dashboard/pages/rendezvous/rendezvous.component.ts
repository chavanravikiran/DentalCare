import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent } from '../../components/full-calendar/full-calendar.component';
import { FiltersBarComponent } from '../../components/filters-bar/filters-bar.component';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';
import {RendezvousService} from '../../../../core/services/rendezvous.service';
import {RendezVousRequest} from '../../models/rendezvous-request.model';
import { CalendarModalComponent } from '../../components/calendar-modal/calendar-modal.component';
import {RendezVousAdminResponse} from '../../models/rendezvous-admin-response.model';
import {TypeRdv} from '../../../../core/constants/rdv-types.model';
import {CalendarModalEditComponent} from '../../components/calendar-modal-edit/calendar-modal-edit.component';
import {RendezVousResponse} from '../../models/rendezvous-response.model';
import  { CalendarSearchModalComponent} from '../../components/calendar-search-modal/calendar-search-modal.component';
import {MatDialog} from '@angular/material/dialog';
import{ ConfirmationDialogComponent} from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarComponent,
    FiltersBarComponent,
    LucideIconsModule,
    CalendarModalEditComponent,
    CalendarModalComponent,
    CalendarSearchModalComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent {
  @ViewChild('calendarRef') calendarRef!: FullCalendarComponent;

  selectedMonth = this.formatMonth(new Date());
  showModal = false;
  refreshTrigger: number = 0;
  showEditModal = false;
  rdvToEdit: RendezVousAdminResponse | null = null;
  // Champs de formulaire
  patientName = '';
  startTime = '';
  endTime = '';
  motif = '';
  type = 'CONSULTATION';
  praticien = 'Dr. Zahra';
  showSearchModal = false;
  rdvsFound: RendezVousResponse[] = [];
  searchResults: RendezVousAdminResponse[] = [];
  showSearchResults = false;
  showDeleteConfirm = false;
  rdvToDeleteId: number | null = null;


  constructor(private rendezvousService: RendezvousService,
              private dialog: MatDialog) {}

  onMonthChanged(month: string) {
    this.selectedMonth = month;
  }
  onOpenModal(): void {
    this.showModal = true;
  }
  onRdvClicked(rdv: RendezVousAdminResponse): void {
    this.rdvToEdit = rdv;
    this.showEditModal = true;
  }
  onCloseEditModal(): void {
    this.showEditModal = false;
    this.rdvToEdit = null;
  }
  onRefresh(): void {
    this.refreshTrigger = this.refreshTrigger + 1;
  }
  onCloseModal(): void {
    this.showModal = false;
  }
  onOpenSearchModal(): void {
    this.showSearchModal = true;
  }

  onCloseSearchModal(): void {
    this.showSearchModal = false;
    this.rdvsFound = [];
  }
  onAppointmentUpdated(data: {
    date: string;
    heureDebut: string;
    heureFin: string;
    motif: string;
    type: 'CONSULTATION' | 'SUIVI' | 'DETARTRAGE' | 'AUTRE';
    status: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE';
  }): void {
    if (!this.rdvToEdit) return;

    this.rendezvousService.updateRendezVous(this.rdvToEdit.id, {
      date: data.date,
      heureDebut: data.heureDebut,
      heureFin: data.heureFin,
      motif: data.motif,
      type: data.type as TypeRdv,
      status: data.status
    }).subscribe({
      next: () => {
        this.refreshTrigger++;
        this.showEditModal = false;
      },
      error: err => console.error('Erreur modification RDV', err)
    });
  }
  onAppointmentCreated(event: {
    startTime: string;
    endTime: string;
    motif: string;
    type: string;
    praticien: string;
  }): void {
    const startDateTime = new Date(event.startTime);
    const endDateTime = new Date(event.endTime);

    const request: RendezVousRequest = {
      date: startDateTime.toISOString().split('T')[0],                 // YYYY-MM-DD
      heureDebut: startDateTime.toTimeString().substring(0, 5),        // HH:mm
      heureFin: endDateTime.toTimeString().substring(0, 5),            // HH:mm
      type: event.type as 'CONSULTATION' | 'SUIVI' | 'DETARTRAGE' | 'AUTRE',
      motif: event.motif
    };

    this.rendezvousService.createRendezVous(request).subscribe({
      next: () => {
        this.refreshTrigger++;
        this.showModal = false;
      },
      error: err => console.error('Erreur création RDV', err)
    });
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  onSearch(event: { mode: 'name' | 'date', term: string }): void {
    if (!event.term || event.term.trim() === '') {
      alert("❌ Veuillez entrer une valeur de recherche.");
      return;
    }

    const request$ =
      event.mode === 'name'
        ? this.rendezvousService.searchAdminRdvByNameOrEmail(event.term.trim())
        : this.rendezvousService.searchAdminRdvByDate(event.term.trim());

    request$.subscribe({
      next: (results) => {
        console.log("✅ Résultats reçus :", results);
        if (!results || results.length === 0) {
          alert("📭 Aucun rendez-vous trouvé.");
          return;
        }
        // ✅ Cas recherche par date → rediriger le calendrier vers ce jour
        if (event.mode === 'date') {
          const targetDate = results[0].date;
          const calendarApi = this.calendarRef?.calendarComponent?.getApi();
          if (calendarApi) {
            calendarApi.gotoDate(targetDate);           // Aller à la date
            calendarApi.changeView('timeGridDay');       // Vue jour
            this.refreshTrigger++;                       // Rechargement
            this.showSearchModal = false;
            return;
          }
        }
        if (results.length === 1) {
          // ✅ Un seul résultat → ouvrir en modification
          this.rdvToEdit = results[0];
          this.showEditModal = true;
          this.showSearchModal = false;
        } else {
          // 🔍 Plusieurs résultats : afficher liste à choisir
          this.searchResults = results; // Crée une propriété pour stocker les résultats
          this.showSearchResults = true; // Active un bloc *ngIf dans ton HTML
          this.showSearchModal = false;
        }
      },
      error: (err) => {
        console.error("Erreur lors de la recherche :", err);
        alert("❌ Une erreur est survenue lors de la recherche. Vérifiez le terme ou réessayez plus tard.");
      }
    });
  }
// Gérer la suppression après confirmation
  onRequestDelete(rdvId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation de suppression',
        message: 'Voulez-vous vraiment supprimer ce rendez-vous ?',
        confirmText: 'Oui, supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteRendezVous(rdvId);
      }
    });
  }

  private deleteRendezVous(rdvId: number): void {
    this.rendezvousService.deleteById(rdvId).subscribe({
      next: () => {
        this.refreshTrigger++;
        this.showEditModal = false;
        this.rdvToEdit = null;
      },
      error: err => {
        console.error('Erreur lors de la suppression :', err);
        alert("❌ Une erreur est survenue pendant la suppression.");
      }
    });
  }


}
