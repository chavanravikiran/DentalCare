import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WebSocketService } from '../../../../core/services/websocket.service';

import { RendezVousResponse } from '../../../dashboard/models/rendezvous-response.model';
import { RendezVousRequest } from '../../../dashboard/models/rendezvous-request.model';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { AppointmentsTableComponent } from '../../components/appointments-table/appointments-table.component';
// import { AppointmentsTableComponent } from '../../components/appointments-table/appointments-table.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    AppointmentFormComponent,
    AppointmentsTableComponent
  ]
})
export class BookingComponent implements OnInit {
  private rendezvousService = inject(RendezvousService);
  private toast = inject(ToastService);
  private websocketService = inject(WebSocketService);

  @ViewChild('calendarRef') calendarComponent!: FullCalendarComponent;

  calendarOptions!: CalendarOptions;
  reservedSlots: RendezVousResponse[] = [];

  showForm = false;
  showTable = true;
  selectedDate = '';
  heureDebut = '';
  heureFin = '';
  selectedType = '';

  ngOnInit(): void {
    this.initializeCalendar();

    this.websocketService.connect();

    // WebSocket simply triggers onMonthChange via the Calendar API
    this.websocketService.confirmedRdv$.subscribe(() => this.triggerCalendarReload());
    this.websocketService.newRdv$.subscribe(() => this.triggerCalendarReload());
    this.websocketService.rejectedRdv$.subscribe(() => this.triggerCalendarReload());
  }

  initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      editable: false,
      locale: frLocale,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: [],
      eventClick: this.onEventClick.bind(this),
      dateClick: this.onDateClick.bind(this),
      datesSet: this.onMonthChange.bind(this), // 🔁 triggers with each change of month
    };
  }

  onMonthChange(arg: any): void {
    // 🔧 Use arg.view.currentStart instead of arg.start
    // to get the first day of the current calendar month
    const currentDate = arg.view.currentStart;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    console.log(`Loading appointments for ${year}-${month}`); // Debug

    this.rendezvousService.getPublicByMonth(year, month).subscribe({
      next: (rdvs) => {
        this.reservedSlots = rdvs;
        this.renderAppointmentsToCalendar(rdvs);
      },
      error: () => {
        this.toast.error('❌ Error loading confirmed appointments');
      }
    });
  }

// ✅ Calls a "clean" refresh by re-triggering datesSet
  triggerCalendarReload(): void {
    const calendarApi = this.calendarComponent.getApi();
    const currentDate = calendarApi.getDate();
    calendarApi.gotoDate(currentDate); // This re-triggers datesSet, so onMonthChange
  }

  renderAppointmentsToCalendar(rdvs: RendezVousResponse[]): void {
    const events = rdvs.map(rdv => ({
      id: rdv.id.toString(),
      title: `${rdv.heureDebut.slice(0, 5)} ${rdv.type}`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: '#2563eb'
    }));

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents(); // important to avoid duplication
    events.forEach(event => calendarApi.addEvent(event));
  }


  onDateClick(info: any): void {
    this.selectedDate = info.dateStr;
    this.showForm = true;
  }

  onEventClick(info: any): void {
    this.toast.info(`⛔ This time slot is already booked.\nDate : ${info.event.startStr}`);
  }

  validerRDV(request: RendezVousRequest): void {
    this.rendezvousService.createRendezVous(request).subscribe({
      next: () => {
        this.toast.success('✅ Appointment pending confirmation.');
        this.showForm = false;
      },
      error: (err) => {
        const msg = err?.error?.message || '❌ An error has occurred.';
        this.toast.error(msg);
      }
    });
  }

  annulerRDV(): void {
    this.showForm = false;
    this.selectedDate = '';
    this.heureDebut = '';
    this.heureFin = '';
    this.selectedType = '';
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
