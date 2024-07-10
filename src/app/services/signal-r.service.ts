import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private messageReceived$ = new Subject<ChatMessage>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7043/chatHub', {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      this.messageReceived$.next(message);
    });

    this.hubConnection.onclose(error => {
      console.error('SignalR connection closed:', error);
    });

    this.hubConnection.onreconnecting(error => {
      console.warn('SignalR reconnecting:', error);
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
    });
  }

  startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started successfully.'))
      .catch(err => console.error('Error starting SignalR connection:', err));
  }

  onMessageReceived(): Observable<ChatMessage> {
    return this.messageReceived$.asObservable();
  }

  // Method to send message to the server
  sendMessage(message: ChatMessage): void {
    this.hubConnection.send('SendMessage', message)
      .then(() => console.log('Message sent successfully.'))
      .catch(err => console.error('Error sending message:', err));
  }
}

// Define the ChatMessage interface to structure the message data
export interface ChatMessage {
  messageId: number;
  senderId: number;
  conversationId: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}
