import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('userRoleId');
    if (role === '0') { // Assuming '0' is for admin
      return true;
    } else {
      // Navigate to home or some other route
      this.router.navigate(['/home']);
      return false;
    }
  }
}
