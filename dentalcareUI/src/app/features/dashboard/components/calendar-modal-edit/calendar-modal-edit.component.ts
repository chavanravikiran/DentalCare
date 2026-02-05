import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezVousAdminResponse } from '../../models/rendezvous-admin-response.model';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-calendar-modal-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconsModule],
  templateUrl: './calendar-modal-edit.component.html'
})
export class CalendarModalEditComponent implements OnInit {
  @Input() rendezVousToEdit!: RendezVousAdminResponse;
  @Output() requestDelete = new EventEmitter<number>(); // id du RDV
  @Output() updateAppointment = new EventEmitter<{
    date: string;
    heureDebut: string;
    heureFin: string;
    motif: string;
    type: 'CONSULTATION' | 'SUIVI' | 'DETARTRAGE' | 'AUTRE';
    status: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE';
  }>();


  @Output() closeModal = new EventEmitter<void>();

  // Champs locaux liés au formulaire
  date = '';
  heureDebut = '';
  heureFin = '';
  motif = '';
  type: 'CONSULTATION' | 'SUIVI' | 'DETARTRAGE' | 'AUTRE' = 'CONSULTATION';
  status: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' = 'EN_ATTENTE';

  ngOnInit(): void {
    if (this.rendezVousToEdit) {
      this.date = this.rendezVousToEdit.date;
      this.heureDebut = this.rendezVousToEdit.heureDebut;
      this.heureFin = this.rendezVousToEdit.heureFin;
      this.motif = this.rendezVousToEdit.motif;
      this.type = this.rendezVousToEdit.type as any;
      this.status = this.rendezVousToEdit.status as any;

    }
  }

  submit(): void {
    this.updateAppointment.emit({
      date: this.date,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      motif: this.motif,
      type: this.type,
      status: this.status
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  onRequestDelete(): void {
    if (this.rendezVousToEdit) {
      this.requestDelete.emit(this.rendezVousToEdit.id);
    }
  }
}
