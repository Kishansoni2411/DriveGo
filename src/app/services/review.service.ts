import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'https://localhost:7043/api/Review';

  constructor(private http: HttpClient) { }

  addReview(review: { userid: number, rating: number, description: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/add`, review, { headers, responseType: 'text' });
  }
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}


