// car-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService, Car } from '../../../services/cars.service';

import { CommonModule } from '@angular/common';
import { FormsModule , FormBuilder } from '@angular/forms';
import { UserModel } from '../../../model/UserModel';
import { AuthenticationService } from '../../../services/authentication.service';
import { ChatService } from '../../../services/chat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cardetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cardetails.component.html',
  styleUrls: ['./cardetails.component.css']
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  owner: UserModel | null = null;
  error: string | null = null;
  showOwnerContact: boolean = false;
  showLocationDetails: boolean = false;
  showMessageInput: boolean = false;
  messageText: string = '';
  senderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private userService: AuthenticationService,
    private chatService: ChatService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    const carId = Number(this.route.snapshot.paramMap.get('carId'));
    this.fetchCarDetails(carId);
  }

  fetchCarDetails(carId: number): void {
    this.carService.getCar(carId).subscribe(
      (data: Car | null) => {
        this.car = data;
        if (this.car && this.car.userId) {
          this.fetchOwnerDetails(this.car.userId);
        }
      },
      (err: any) => {
        this.toaster.error("Failed to load car details.","Error");
        this.error = 'Failed to load car details';
      }
    );
  }

  fetchOwnerDetails(userId: number): void {
    this.userService.getUserDetails(userId).subscribe(
      (data: UserModel | null) => {
        this.owner = data;
       
      },
      (err: any) => {
        this.toaster.error("Failed to load owner details. Please try again...","Error");
        this.error = 'Failed to load owner details';
      }
    );
  }

  toggleOwnerContact(): void {
    this.showOwnerContact = !this.showOwnerContact;
    this.showLocationDetails = false;
    this.showMessageInput = false;
  }

  toggleLocationDetails(): void {
    this.showLocationDetails = !this.showLocationDetails;
    this.showOwnerContact = false;
    this.showMessageInput = false;
  }

  toggleMessageInput(): void {
    this.showMessageInput = !this.showMessageInput;
    this.showOwnerContact = false;
    this.showLocationDetails = false;
  }

  sendMessage(): void {
    if (this.messageText.trim() === '') {
      this.toaster.error("Please enter a message..","error");
      
      return;
    }

    this.senderId = this.getUserIdFromLocalStorage();
    if (this.senderId === null) {
      this.toaster.error("User is not authenticated. Please log in to send a message..","error");
      
      return;
    }

    const receiverId = this.car?.userId ?? 0;
    const message = this.messageText;

    console.log(this.senderId, receiverId, message);

    this.chatService.sendMessage(this.senderId, receiverId, message).subscribe(
      (response: any) => {
        console.log('Message sent successfully:', response);
        this.toaster.success("Message sent successfully!","Success");
        
        this.messageText = ''; // Clear message input after successful send
      },
      (error: any) => {
        console.error('Error sending message:', error);
        this.toaster.error("Error sending message. Please try again later..","error");
       
      }
    );
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
}