// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);

  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRoleId');
console.log(token)
if (token && token.trim() !== '' || role === '1') {
  return true; // Allow navigation
} else {
  // Redirect to home page if conditions are not met
  router.navigate(['/home']);
  return false; // Deny navigation
}
};
