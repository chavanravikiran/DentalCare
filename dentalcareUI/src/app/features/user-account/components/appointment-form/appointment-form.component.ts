import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezVousRequest } from '../../../dashboard/models/rendezvous-request.model';
import { RdvUtilsService, ReservedSlot } from '../../../../core/services/rdv-utils.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { TypeRdv} from '../../../../core/constants/rdv-types.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  @Input() selectedDate!: string;
  @Input() doctorId!: number;
  // @Input() reservedSlots: ReservedSlot[] = [];
  @Input() type: TypeRdv = 'CONSULTATION';
  @Input() availableSlots: any[] = [];

  @Output() submit = new EventEmitter<RendezVousRequest>();
  @Output() cancel = new EventEmitter<void>();

  typeOptions = ['CONSULTATION', 'DESCALING', 'URGENCE'];
  // selectedSlot: string = '';
  selectedType: string = '';
  motif: string = '';
  selectedSlot: any = null;
  constructor(private rdvUtils: RdvUtilsService) {}

  // get availableSlots(): string[] {
  //   return this.rdvUtils.getAvailableSlots(this.selectedDate, this.reservedSlots);
  // }

  onSubmit(): void {
    if (!this.selectedSlot || !this.selectedType) {
      alert('Please select a time slot and a type.');
      return;
    }

    const [heureDebut, heureFin] = this.selectedSlot.split(' - ');
    const request: RendezVousRequest = {
      // date: this.selectedDate,
      // heureDebut,
      // heureFin,
      // type: this.selectedType as TypeRdv,
      // motif: this.motif
      date: this.selectedDate,
      heureDebut,
      heureFin,
      type: this.selectedType  as TypeRdv,
      motif: this.motif,
      slotId: this.selectedSlot.id,
      doctorId: this.doctorId
    };


    this.submit.emit(request);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
