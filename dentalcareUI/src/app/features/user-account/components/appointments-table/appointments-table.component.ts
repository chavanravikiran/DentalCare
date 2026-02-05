import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendezVousResponse } from '../../../dashboard/models/rendezvous-response.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-appointments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-table.component.html',
  styleUrls: ['./appointments-table.component.css']
})
export class AppointmentsTableComponent {
  @Input() appointments: RendezVousResponse[] = [];

  formatDate(date: string, format = 'dd/MM/yyyy'): string {
    return formatDate(date, format, 'fr-FR');
  }
}
