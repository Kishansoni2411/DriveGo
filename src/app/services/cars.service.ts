import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse ,  HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Car {
  carId: number;
  userId: number;
  vehicleNumber: string | null;
  gearType: string | null;
  fuelType: string | null;
  seat: number | null;
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

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'https://localhost:7043/api/Car';

  constructor(private http: HttpClient) {}

 
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/display-all`)
      .pipe(catchError(this.handleError));
  }

  
  getCar(carId: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/details-id/${carId}`)
      .pipe(catchError(this.handleError));
  }

  
  getCarsByUser(userId: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/display-user/${userId}`)
      .pipe(catchError(this.handleError));
  }

 
  addCar(car: Partial<Car>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addcar`, car, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
  }

 
  updateCar(car: Partial<Car>): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, car, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
  }

 
  deleteCar(carId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${carId}`).pipe(catchError(this.handleError));
  }

  
  searchCars(searchText: string): Observable<Car[]> {
    const params = new HttpParams().set('searchText', searchText);
    return this.http.get<Car[]>(`${this.apiUrl}/search`, { params }).pipe(catchError(this.handleError));
  }

  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(`Server-side error: Code ${error.status}, Message: ${error.message}`);
      errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}