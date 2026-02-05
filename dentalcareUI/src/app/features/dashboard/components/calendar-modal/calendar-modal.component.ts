import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.css']
})
export class CalendarModalComponent {

  /** patient's name entered in the form */
  @Input() patientName: string = '';
  @Output() patientNameChange = new EventEmitter<string>();
  /** Start date and time */
  @Input() startTime: string = '';
  @Output() startTimeChange = new EventEmitter<string>();
  /** End date and time */
  @Input() endTime: string = '';
  @Output() endTimeChange = new EventEmitter<string>();

  /** 🗨️ Reason for the appointment */
  @Input() motif: string = '';
  @Output() motifChange = new EventEmitter<string>();
  /** 🦷 Type of appointment */
  @Input() type: string = 'CONSULTATION';
  @Output() typeChange = new EventEmitter<string>();

  /** 👨‍⚕️ Assigned Practitioner */
  @Input() praticien: string = 'Dr. Zahra';
  @Output() praticienChange = new EventEmitter<string>();


  /** 📤 Form submission */
  @Output() createAppointment = new EventEmitter<{
    patientName: string;
    startTime: string;
    endTime: string;
    motif: string;
    type: string;
    praticien: string;
  }>();

  /** Event triggered when the modal is closed */
  @Output() closeModal = new EventEmitter<void>();

  submit(): void {
    if (this.patientName && this.startTime && this.endTime && this.motif && this.type && this.praticien) {
      this.createAppointment.emit({
        patientName: this.patientName,
        startTime: this.startTime,
        endTime: this.endTime,
        motif: this.motif,
        type: this.type,
        praticien: this.praticien
      });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
