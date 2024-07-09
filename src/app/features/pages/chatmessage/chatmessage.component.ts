// chatmessage.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalRService } from '../../../services/signal-r.service';
import { ChatService } from '../../../services/chat.service';


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
  isRead: boolean;
}


@Component({
  selector: 'app-chatmessage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatmessage.component.html',
  styleUrls: ['./chatmessage.component.css']
})
export class ChatmessageComponent implements OnInit {

  users: ChatUser[] = [];
  selectedUser: ChatUser | null = null;
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId: number | null = null;

  constructor(private chatService: ChatService, private signalRService: SignalRService) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.signalRService.startConnection();
    this.signalRService.onMessageReceived().subscribe((message: ChatMessage) => {
      this.onNewMessageReceived(message);
    });
  }

  loadCurrentUser() {
    const userIdFromLocalStorage = this.getUserIdFromLocalStorage();
    if (userIdFromLocalStorage !== null) {
      this.currentUserId = userIdFromLocalStorage;
      this.loadContacts();
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  loadContacts() {
    if (this.currentUserId !== null) {
      this.chatService.getContacts(this.currentUserId).subscribe(
        (users: ChatUser[]) => {
          this.users = users;
        },
        (error: any) => {
          console.error('Error loading contacts:', error);
        }
      );
    } else {
      console.error('Current user ID is null.');
    }
  }

  selectUser(user: ChatUser) {
    this.selectedUser = user;
    this.loadChatMessages(user.conversationId);
  }

  loadChatMessages(conversationId: number) {
    if (this.currentUserId !== null) {
      this.chatService.getChatMessages(conversationId).subscribe(
        (messages: any) => {
          this.chatMessages = messages;
          
        },
        (error: any) => {
          console.error('Error loading chat messages:', error);
        }
      );
    } else {
      console.error('Current user ID is null.');
    }
  }
 

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim() && this.currentUserId !== null) {
      this.chatService.sendMessage(this.currentUserId, this.selectedUser.userId, this.newMessage).subscribe(
        (response: any) => {
          this.newMessage = ''; // Clear the input field after sending
          this.loadChatMessages(this.selectedUser!.conversationId); // Reload messages after sending
        },
        (error: any) => {
          console.error('Error sending message:', error);
        }
      );
    } else {
      console.error('User ID not found or invalid.');
    }
  }

  onNewMessageReceived(message: ChatMessage) {
    if (this.selectedUser && message.conversationId === this.selectedUser.conversationId) {
      this.chatMessages.push(message);
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userid');
    if (userIdString) {
      const userIdNumber = Number(userIdString);
      if (!isNaN(userIdNumber)) {
        return userIdNumber;
      }
    }
    return null;
  }

  // Function to group messages by date
  groupMessagesByDate(messages: ChatMessage[]): { date: string, messages: ChatMessage[] }[] {
    const groupedMessages: { date: string, messages: ChatMessage[] }[] = [];
    let currentDate: string | null = null;

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();

      if (currentDate !== messageDate) {
        currentDate = messageDate;
        groupedMessages.push({ date: currentDate, messages: [message] });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(message);
      }
    });

    return groupedMessages;
  }
}
