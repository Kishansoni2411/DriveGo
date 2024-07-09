import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Router } from '@angular/router';
import { CarService } from '../../../services/cars.service';

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
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarComponent implements OnInit {
  cars: Car[] = [];
  displayedCars: Car[] = [];
  filteredCars: Car[] = [];
  searchText: string = '';
  selectedType: string = '';
  itemsPerLoad: number = 12;
  currentIndex: number = 0;
  error: string | null = null;

  constructor(private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars(): void {
    this.carService.getCars().subscribe(
      (data:any) => {
        this.cars = data;
        this.filterCars();
      },
      (err:any) => {
        this.error = err;
      }
    );
  }

  filterCars(): void {
    if (this.searchText.trim() !== '') {
      this.filteredCars = this.cars.filter(car => {
        const matchesSearch = car.model.toLowerCase().includes(this.searchText.toLowerCase());
        const matchesType = this.selectedType ? car.carType === this.selectedType : true;
        return matchesSearch && matchesType;
      });
    } else {
      this.filteredCars = this.cars.filter(car => {
        return this.selectedType ? car.carType === this.selectedType : true;
      });
    }
    this.resetDisplayCars();
  }

  resetDisplayCars(): void {
    this.displayedCars = [];
    this.currentIndex = 0;
    this.loadMoreCars();
  }

  loadMoreCars(): void {
    const nextCars = this.filteredCars.slice(this.currentIndex, this.currentIndex + this.itemsPerLoad);
    this.displayedCars = this.displayedCars.concat(nextCars);
    this.currentIndex += this.itemsPerLoad;
  }

  onScroll(): void {
    this.loadMoreCars();
  }

  goToCarDetails(carId: number): void {
    this.router.navigate(['/car-details', carId]);
  }
}
