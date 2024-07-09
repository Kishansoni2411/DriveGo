import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface ChatUser {
  userId: number;
  username: string;
  conversationId: number;
}

interface ChatMessage {
  messageId: number;
  senderId: number;
  conversationId: number;
  message: string;
  timestamp: string;
  isread: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:7043/api/Chat'; // Adjust your API URL

  constructor(private http: HttpClient) { }

  getContacts(userId: number): Observable<ChatUser[]> {
    return this.http.get<ChatUser[]>(`${this.apiUrl}/connectedusers/${userId}`);
  }

  getChatMessages(conversationId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${conversationId}`);
  }
 
  sendMessage(senderId: number, receiverId: number, message: string): Observable<any> {
    const chatMessage = { senderId, receiverId, message };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/sendmessage`, chatMessage, { headers });
  }
}