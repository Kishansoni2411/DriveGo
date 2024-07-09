import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../../../services/cars.service'; // Update the import path based on your project structure
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Car {
  carId: number;
  userId: number;
  carType: string;
  company: string;
  model: string;
  year: number;
  color: string | null;
  price: number;
  mileage: number;
  description: string | null;
  imageUrl: string | null;
  status: string;
}

@Component({
  selector: 'app-mylistings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mylistings.component.html',
  styleUrls: ['./mylistings.component.css']
})
export class MylistingsComponent implements OnInit {
  cars: Car[] = [];
  userId: number | null = null;
  error: string | null = null;

  constructor(private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    localStorage.getItem('username') || '';
    this.userId = this.getUserIdFromLocalStorage();
    if (this.userId) {
      this.fetchUserCars(this.userId);
    } else {
      this.error = 'User not found. Please log in.';
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

  fetchUserCars(userId: number): void {
    this.carService.getCarsByUser(userId).subscribe(
      (data) => {
        this.cars = data;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  goToCarDetails(carId: number): void {
    this.router.navigate(['/car-details', carId]);
  }

  addNewListing(): void {
    this.router.navigate(['/add-car']); // Adjust this path according to your route configuration for adding a new car
  }

  goToActionCar(carId: number): void { // New Method for Action Button
    this.router.navigate(['/action-car', carId]);
  }
}
