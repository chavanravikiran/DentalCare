import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js'; // ✅ usable as constructor
import { Subject } from 'rxjs';
import { RendezVousResponse } from '../../features/dashboard/models/rendezvous-response.model';
import { NotificationResponse } from '../../features/dashboard/models/notification-response.model';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly stompClient!: Client;

  public newRdv$ = new Subject<RendezVousResponse>();
  public confirmedRdv$ = new Subject<RendezVousResponse>();
  public rejectedRdv$ = new Subject<RendezVousResponse>();
  public notification$ = new Subject<NotificationResponse>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`), // ✅ good /ws
      debug: (str) => console.log('[WS DEBUG] ' + str),
      reconnectDelay: 5000
    });

  }

  public connect(): void {
    if (this.stompClient && this.stompClient.active) {
      console.warn('⚠️ WebSocket already connected.');
      return;
    }
    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket connected 🎉');

      this.stompClient.subscribe('/topic/rdv/new', (message: IMessage) => {
        console.log('🆕 New appointment received :', message.body);
        this.newRdv$.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/rdv/confirmed', (message: IMessage) => {
        console.log('☑️ Confirmed appointment:', message.body);
        this.confirmedRdv$.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/rdv/rejected', (message: IMessage) => {
        console.log('❌ Appointment rejected :', message.body);
        this.rejectedRdv$.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
        console.log('🔔 Notification received :', message.body);
        this.notification$.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Error STOMP :', frame.headers['message'], frame.body);
    };

    this.stompClient.activate();
  }

  public async disconnect(): Promise<void> {
    if (this.stompClient?.active) {
      try {
        await this.stompClient.deactivate();
        console.log('✅ WebSocket properly disconnected');
      } catch (error) {
        console.error('❌ WebSocket disconnection failed', error);
      }
    }
  }
  public isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }

}
