import { Component, OnInit, ViewChild, inject, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { RendezvousService } from '../../../core/services/rendezvous.service';
import { AuthService } from '../../../core/services/auth.service';
import { RendezVousResponse } from '../../dashboard/models/rendezvous-response.model';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-public',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FullCalendarModule,
    LucideIconsModule
  ],
  templateUrl: './calendar-public.component.html',
  styleUrls: ['./calendar-public.component.css']
})
export class CalendarPublicComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private rendezvousService = inject(RendezvousService);
  private authService = inject(AuthService);

  @ViewChild('calendarRef') calendarComponent!: FullCalendarComponent;

  isAuthenticated = false;
  appointmentType = 'Tout afficher';
  selectedMonth = '';
  selectedPractitioner = '';

  // Statistics
  totalAppointments = 0;
  availableSlots = 0;
  bookedSlots = 0;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    selectable: true,
    editable: false,
    height: 'auto',
    dayMaxEventRows: 3,
    weekends: true,
    events: [],
    eventColor: '#3b82f6',
    eventDisplay: 'block',
    eventClick: this.onEventClick.bind(this),
    dateClick: this.onDateClick.bind(this),
    datesSet: () => this.handleMonthChange(),
    eventDidMount: (info) => {
      // Add custom styling based on event type
      const eventEl = info.el;
      const eventData = info.event.extendedProps;

      if (eventData['isAvailable']) {
        eventEl.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        eventEl.style.borderColor = '#1d4ed8';
      } else {
        eventEl.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
        eventEl.style.borderColor = '#4b5563';
      }

      eventEl.style.borderRadius = '8px';
      eventEl.style.border = 'none';
      eventEl.style.fontSize = '0.875rem';
      eventEl.style.fontWeight = '600';
    }
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    const today = new Date();
    this.selectedMonth = this.formatDateToMonthInput(today);
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.enhanceCalendarUX();
  }

  handleMonthChange(): void {
    const calendarApi = this.calendarComponent.getApi();
    const currentDate = calendarApi.getDate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    setTimeout(() => {
      this.selectedMonth = this.formatDateToMonthInput(currentDate);
    }, 0);

    this.loadDisponibilites(year, month);
  }

  onMonthInputChange(event: any): void {
    const value = event.target.value;
    this.selectedMonth = value;
    const [year, month] = value.split('-').map(Number);
    this.calendarComponent.getApi().gotoDate(`${year}-${month.toString().padStart(2, '0')}-01`);
  }

  applyFilters(): void {
    const current = this.calendarComponent.getApi().getDate();
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    this.loadDisponibilites(year, month);

    // Add filter animation
    this.animateFilterChange();
  }

  private loadInitialData(): void {
    const current = new Date();
    this.loadDisponibilites(current.getFullYear(), current.getMonth() + 1);
  }

  private fetchRendezVousByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.rendezvousService.getPublicByMonth(year, month);
  }

  loadDisponibilites(year: number, month: number): void {
    this.fetchRendezVousByMonth(year, month).subscribe({
      next: (rdvs) => {
        const filtered = this.filterAppointmentsByType(rdvs);
        this.renderAppointmentsToCalendar(filtered);
        this.updateStatistics(filtered);
      },
      error: (err) => {
        console.error('❌ Error loading appointments.', err);
        this.showErrorMessage('Unable to load calendar. Please try again.');
      }
    });
  }

  private filterAppointmentsByType(rdvs: RendezVousResponse[]): RendezVousResponse[] {
    let filtered = rdvs.filter(rdv => rdv.status === 'CONFIRME');

    if (this.appointmentType !== 'Tout afficher') {
      filtered = filtered.filter(rdv => rdv.type === this.appointmentType);
    }

    return filtered;
  }

  private renderAppointmentsToCalendar(rdvs: RendezVousResponse[]): void {
    const events = rdvs.map((rdv) => ({
      id: rdv.id.toString(),
      title: `${rdv.heureDebut.slice(0, 5)} ${rdv.type}`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: this.getEventColor(rdv.type || ''),
      extendedProps: {
        isAvailable: false,
        type: rdv.type,
        practitioner: rdv.praticien
      }
    }));

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    events.forEach(e => calendarApi.addEvent(e));
  }

  private getEventColor(type: string): string {
    const colors: { [key: string]: string } = {
      'CONSULTATION': '#3b82f6',
      'DETARTRAGE': '#10b981',
      'URGENCE': '#ef4444',
      'ESTHETIQUE': '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  }

  private updateStatistics(rdvs: RendezVousResponse[]): void {
    this.totalAppointments = rdvs.length;
    this.bookedSlots = rdvs.length;
    // Calculate available slots (this would typically come from your backend)
    this.availableSlots = Math.max(0, 100 - this.bookedSlots); // Example calculation
  }

  onEventClick(info: any): void {
    const title = info.event.title;
    const date = info.event.startStr;
    const type = info.event.extendedProps.type;

    this.showAppointmentDetails({
      title,
      date,
      type,
      isAvailable: info.event.extendedProps.isAvailable
    });
  }

  onDateClick(info: any): void {
    if (!this.isAuthenticated) {
      this.showAuthPrompt();
      return;
    }

    const date = info.dateStr;
    this.router.navigate(['/user-account/prendre-rdv'], {
      queryParams: { date }
    }).then(success => {
      if (!success) {
        console.warn('⚠️ The redirection failed.');
      }
    });
  }

  onStartReservation(): void {
    this.router.navigate(['/user-account/prendre-rdv']).then(success => {
      if (!success) {
        console.warn('⚠️ The redirection failed.');
      }
    });
  }

  private formatDateToMonthInput(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = this.el.nativeElement.querySelectorAll(
      '.calendar-header, .filters-section, .calendar-container, .info-card'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });

    this.addAnimationStyles();
  }

  private addAnimationStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .calendar-header, .filters-section, .calendar-container, .info-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .calendar-header.animate-in, .filters-section.animate-in,
      .calendar-container.animate-in, .info-card.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      .info-card:nth-child(1).animate-in { transition-delay: 0.1s; }
      .info-card:nth-child(2).animate-in { transition-delay: 0.2s; }
      .info-card:nth-child(3).animate-in { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
  }

  private enhanceCalendarUX(): void {
    // Add hover effects to calendar days
    setTimeout(() => {
      const calendarEl = this.el.nativeElement.querySelector('.fc');
      if (calendarEl) {
        calendarEl.addEventListener('mouseover', (e: any) => {
          if (e.target.classList.contains('fc-daygrid-day')) {
            e.target.style.backgroundColor = 'rgba(15, 118, 110, 0.05)';
          }
        });

        calendarEl.addEventListener('mouseout', (e: any) => {
          if (e.target.classList.contains('fc-daygrid-day')) {
            e.target.style.backgroundColor = '';
          }
        });
      }
    }, 1000);
  }

  private animateFilterChange(): void {
    const container = this.el.nativeElement.querySelector('.calendar-container');
    if (container) {
      container.style.transform = 'scale(0.95)';
      container.style.opacity = '0.7';

      setTimeout(() => {
        container.style.transform = 'scale(1)';
        container.style.opacity = '1';
      }, 150);
    }
  }

  private showAppointmentDetails(appointment: any): void {
    const message = appointment.isAvailable
      ? `✅ Available time slot on ${appointment.date}\nType: ${appointment.type}`
      : `⛔ This time slot is already booked.\nDate: ${appointment.date}\nType: ${appointment.type}`;

    alert(message);
  }

  private showAuthPrompt(): void {
    const shouldRedirect = confirm(
      '🔐 You must be logged in to book an appointment.\n\nDo you wish to log in now?'
    );

    if (shouldRedirect) {
      this.router.navigate(['/login']);
    }
  }

  private showErrorMessage(message: string): void {
    // In a real app, you'd use a proper notification service
    alert(`❌ ${message}`);
  }

  // Analytics and tracking methods
  trackFilterChange(filterType: string, value: string): void {
    console.log(`Filter changed: ${filterType} = ${value}`);
    // Add analytics tracking here
  }

  trackCalendarInteraction(action: string, data?: any): void {
    console.log(`Calendar interaction: ${action}`, data);
    // Add analytics tracking here
  }
}
