// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../model/UserModel';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private baseUrl = 'https://localhost:7043/api';

  constructor(private http: HttpClient) { }


  signup(signupData: UserModel): Observable<any> {
    const url = `${this.baseUrl}/Authentication/signup`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, signupData, { headers });
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/Authentication/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ UserEmail: username, Password: password });

    return this.http.post<any>(url, body, { headers }).pipe(
      map((response:any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          const decodedToken = jwtDecode(response.token) as { userRoleId: string, userid: string, username: string };
          localStorage.setItem('userRoleId', decodedToken.userRoleId);
          localStorage.setItem('userid', decodedToken.userid);
          localStorage.setItem('username', decodedToken.username);
        }
        return response;
      })
    );
  }

  getAllUsers(): Observable<UserModel[]> {
    const url = `${this.baseUrl}/Authentication/getallusers`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<UserModel[]>(url, { headers });
  }

  getUserDetails(userId: number): Observable<any> {
    const url = `${this.baseUrl}/Authentication/getuser/${userId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<UserModel>(url, { headers });
  }


  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/Authentication/updatepassword`;
    const body = { userId, currentPassword, newPassword };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(url, body, { headers });
  }
  
  updateUserDetails(updatedUserData: UserModel): Observable<any> {
    const url = `${this.baseUrl}/Authentication/updateuser`;
    return this.http.post<any>(url, updatedUserData);
  }

  validateUserEmail(email: string): Observable<any> {
    const url = `${this.baseUrl}/Authentication/checkemailexists?EmailId=${encodeURIComponent(email)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, { headers });
  }

  validateOtp(email: string, otp: number): Observable<any> {
    // Encode the email to ensure it is URL safe
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.baseUrl}/Authentication/validateotp?email=${encodedEmail}&otp=${otp}`;

    // No need for body or headers in this case
    return this.http.post<any>(url, {});
  }

  resetUserPassword(email: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/Authentication/changeuserpassword`;
    const body = { userEmail: email, password: newPassword };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers });
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoleId');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}





































