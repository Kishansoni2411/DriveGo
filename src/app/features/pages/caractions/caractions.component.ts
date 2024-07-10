import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService, Car } from '../../../services/cars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-caractions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './caractions.component.html',
  styleUrls: ['./caractions.component.css']
})


export class CarActionsComponent implements OnInit {
  addCarForm!: FormGroup;
  userId: number | null = null;
  carId: number | null = null;
  isUpdateMode: boolean = false;
  // toaster=inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService

  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromLocalStorage();
    this.carId = this.route.snapshot.params['carId'];
    this.isUpdateMode = !!this.carId;

    this.addCarForm = this.fb.group({
      carType: ['', Validators.required],
      company: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      color: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      mileage: [null, [Validators.required, Validators.min(0)]],
      description: [''],
      imageUrl: [''],
      status: ['Available', Validators.required],
      vehicleNumber: ['', Validators.required],
      gearType: ['', Validators.required],
      fuelType: ['', Validators.required],
      seat: [null, [Validators.required, Validators.min(1)]]
    });

    if (this.isUpdateMode && this.carId !== null) {
      this.loadCarDetails(this.carId);
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

  loadCarDetails(carId: number): void {
    this.carService.getCar(carId).subscribe(
      (car:any) => {
        this.addCarForm.patchValue(car);
      },
      (error:any) => {
        console.error('Failed to load car details', error);
        this.toaster.error("Failed to load car details. Please try again.","Error");
        
      }
    );
  }

  addOrUpdateCar(): void {
    if (this.addCarForm.valid && this.userId !== null) {
      const carData = { ...this.addCarForm.value, userId: this.userId };
      
      if (this.isUpdateMode && this.carId !== null) {
        this.updateCar({ ...carData, carId: this.carId });
      } else {
        this.addCar(carData);
      }
    } else {
      this.toaster.error("Form is invalid or user not logged in.","Error");
      
    }
  }

  addCar(carData: any): void {
    this.carService.addCar(carData).subscribe(
      (response:any) => {
        console.log('Car added successfully', response);
        this.toaster.success("Car has been successfully added","Success");
        this.router.navigate(['/listing']);
       

      },
      (error:any) => {
        console.error('Failed to add car', error);
       
        this.toaster.error("Failed to add car. Please try again.","Error");
      }
    );
  }

  updateCar(carData: Car): void {
    this.carService.updateCar(carData).subscribe(
      (response:any) => {
        console.log('Car updated successfully', response);
        this.toaster.success("Car has been successfully updated","Success");
        this.router.navigate(['/listing']);
        
      },
      (error:any) => {
       
        this.toaster.error("Failed to add car. Please try again.","Error");
      }
    );
  }

  deleteCar(): void {
    if (this.carId !== null && confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(this.carId).subscribe(
        (response:any) => {
          this.toaster.success("Car has been successfully deleted","Success");
         
          this.router.navigate(['/listing']);
          
        },
        (error:any) => {
          console.error('Failed to delete car', error);
          this.toaster.error("Failed to delete car. Please try again.","Error");
         
        }
      );
    }
  }
}
