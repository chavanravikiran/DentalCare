import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// import frLocale from '@fullcalendar/core/locales/fr';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { RendezVousResponse } from '../../../dashboard/models/rendezvous-response.model';
import { RendezVousRequest } from '../../../dashboard/models/rendezvous-request.model';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { AppointmentsTableComponent } from '../../components/appointments-table/appointments-table.component';

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
  myAppointments: RendezVousResponse[] = [];

  showForm = false;
  showTable = true;
  selectedDate = '';
  heureDebut = '';
  heureFin = '';
  selectedType = '';

  reschedulingId: number | null = null;

  ngOnInit(): void {
    this.loadMyAppointments();
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
      locale: 'en',
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

  // 🔁 If rescheduling
  if (this.reschedulingId) {

    this.rendezvousService
      .rescheduleAppointment(this.reschedulingId, request)
      .subscribe({
        next: () => {
          this.toast.success('✅ Appointment rescheduled successfully');
          this.reschedulingId = null;
          this.showForm = false;

          this.triggerCalendarReload();
          this.loadMyAppointments();
        },
        error: () => {
          this.toast.error('❌ Failed to reschedule appointment');
        }
      });

  }

  // ➕ Normal booking
  else {

    this.rendezvousService.createRendezVous(request).subscribe({
      next: () => {
        this.toast.success('✅ Appointment pending confirmation.');
        this.showForm = false;

        this.triggerCalendarReload();
        this.loadMyAppointments();
      },
      error: (err) => {
        const msg =
          err?.error?.errors?.[0]?.defaultMessage ||
          err?.error?.message ||
          '❌ An error has occurred.';

        this.toast.error(msg);
      }
    });

  }
}

  annulerRDV(): void {
  this.reschedulingId = null;

  this.showForm = false;
  this.selectedDate = '';
  this.heureDebut = '';
  this.heureFin = '';
  this.selectedType = '';
}

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  cancelAppointment(id: number): void {

  if (confirm('Are you sure you want to cancel this appointment?')) {

    this.rendezvousService.cancelAppointment(id).subscribe({
      next: () => {
        this.toast.success('Appointment cancelled successfully');
        this.triggerCalendarReload();
        this.loadMyAppointments();   
      },
      error: () => {
        this.toast.error('Failed to cancel appointment');
      }
    });
  }
}

rescheduleAppointment(rdv: RendezVousResponse): void {

  this.reschedulingId = rdv.id;   // store appointment id

  this.selectedDate = rdv.date;
  this.heureDebut = rdv.heureDebut;
  this.heureFin = rdv.heureFin;

  this.showForm = true;
}

loadMyAppointments(): void {
  this.rendezvousService.getMyRendezVous().subscribe({
    next: (data) => {
      this.myAppointments = data;
    },
    error: () => {
      this.toast.error('❌ Failed to load your appointments');
    }
  });
}
}
