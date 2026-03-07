import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  selectedMessage: Message | null = null;

  messages: Message[] = [
    {
      id: 1,
      sender: 'Khadija B.',
      subject: 'Pain after treatment',
      content: 'Hello doctor, I’m still in pain after yesterday’s session. Should I take anything else besides Paracetamol?',
      date: '31 May 2025, 10:14',
      read: false
    },
    {
      id: 2,
      sender: 'Mohamed E.',
      subject: 'Appointment Confirmation',
      content: 'Thank you for the confirmation. I will be there at 2 PM. Best regards.',
      date: '30 May 2025, 18:02',
      read: true
    },
    {
      id: 3,
      sender: 'Salma R.',
      subject: 'Emergency request',
      content: 'I have been suffering terribly since this morning, is there a quick appointment available?',
      date: '30 May 2025, 08:47',
      read: false
    },
    {
      id: 4,
      sender: 'Youssef H.',
      subject: 'Thanks',
      content: 'Thank you for your professionalism; the pain has completely disappeared. I highly recommend your practice.',
      date: '29 May 2025, 16:20',
      read: true
    }
  ];


  openMessage(msg: Message) {
    this.selectedMessage = msg;
    msg.read = true;
  }

  closeMessage() {
    this.selectedMessage = null;
  }
}
