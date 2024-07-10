import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7043/api/Dashboard';

  constructor(private http: HttpClient) { }

  getTotals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totals`);
  }
  getUsersPerMonth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users-per-month`);
  }
  getCarsPerMonth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cars-per-month`);
  }
  getCarTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/car-types`);
  }
  getReviewsOverTime(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reviews-over-time`);
  }
 
  getReviewsByRating(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reviews-by-rating`);
  }

}