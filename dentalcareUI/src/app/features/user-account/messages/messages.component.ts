import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages = [
    {
      sender: 'Admin Zahra',
      date: '2025-05-30',
      content: 'Please respect your appointments and arrive 10 minutes early.'
    },
    {
      sender: 'Admin Zahra',
      date: '2025-05-27',
      content: 'Your next appointment is awaiting confirmation.'
    },
    {
      sender: 'Admin Zahra',
      date: '2025-05-22',
      content: 'Thank you for your loyalty. Please feel free to contact us with any questions.'
    }
  ];
}
