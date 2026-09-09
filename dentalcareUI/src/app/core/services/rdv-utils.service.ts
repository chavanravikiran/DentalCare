import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

export interface ReservedSlot {
  date: string; // Format YYYY-MM-DD
  heureDebut: string; // Format HH:mm
  heureFin: string;
}


export interface ResevationValidationResult {
  valid: boolean;
  message?: string;
}

export interface DoctorSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export interface AppointmentSlot{
 id:number
 startTime:string
 endTime:string
 booked:boolean
}

@Injectable({ providedIn: 'root' })
export class RdvUtilsService {

  private baseUrl = environment.websiteUrl;
  
  constructor(private http: HttpClient) {}

  

  getAvailableSlots(
    selectedDate: string,
    reservedSlots: ReservedSlot[]
  ): string[] {
    const slots: string[] = [];
    let time = new Date(`2000-01-01T09:00`);
    const end = new Date(`2000-01-01T18:00`);

    while (time < end) {
      const start = time.toTimeString().substring(0, 5);
      const next = new Date(time.getTime() + 30 * 60 * 1000);
      const endStr = next.toTimeString().substring(0, 5);

      const isReserved = reservedSlots.some(r =>
        r.date === selectedDate &&
        r.heureDebut === start &&
        r.heureFin === endStr
      );

      if (!isReserved) {
        slots.push(`${start} - ${endStr}`);
      }

      time = next;
    }

    return slots;
  }

  validateSlotSelection(
    date: string,
    heureDebut: string,
    heureFin: string,
    reservedSlots: ReservedSlot[]
  ): ResevationValidationResult {
    if (!date || !heureDebut || !heureFin) {
      return {
        valid: false,
        message: '🕐 Please select a date and time slot for your appointment.'
      };
    }

    if (this.isWeekend(date)) {
      return {
        valid: false,
        message: '📅 Hello, our office is closed on weekends. Please choose a weekday.'
      };
    }

    if (this.isSlotReserved(date, heureDebut, heureFin, reservedSlots)) {
      return {
        valid: false,
        message: '⛔ This time slot is unfortunately already booked. Please choose another available time.'
      };
    }

    return { valid: true };
  }

  isWeekend(dateStr: string): boolean {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isSlotReserved(
    date: string,
    heureDebut: string,
    heureFin: string,
    reservedSlots: ReservedSlot[]
  ): boolean {
    return reservedSlots.some(r =>
      r.date === date &&
      r.heureDebut === heureDebut &&
      r.heureFin === heureFin
    );
  }
}
