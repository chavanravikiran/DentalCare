import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RendezVousResponse } from '../../../dashboard/models/rendezvous-response.model';

@Component({
  selector: 'app-appointments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-table.component.html',
  styleUrls: ['./appointments-table.component.css']
})
export class AppointmentsTableComponent {

  @Input() appointments: RendezVousResponse[] = [];

  // send events to parent component
  @Output() cancel = new EventEmitter<number>();
  @Output() reschedule = new EventEmitter<RendezVousResponse>();

  formatDate(date: string, format = 'dd/MM/yyyy'): string {
    return formatDate(date, format, 'fr-FR');
  }

  cancelAppointment(id: number) {

    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.cancel.emit(id);
    }

  }

  rescheduleAppointment(rdv: RendezVousResponse) {
    this.reschedule.emit(rdv);
  }

}