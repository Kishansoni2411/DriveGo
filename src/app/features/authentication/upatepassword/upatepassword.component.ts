import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-upatepassword',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule ],
  templateUrl: './upatepassword.component.html',
  styleUrl: './upatepassword.component.css'
})
export class UpatepasswordComponent {
  passwordForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatch
    });
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const userId = localStorage.getItem('userid');
      if (!userId) {
        console.error('User ID not found in local storage');
        alert('User ID not found. Please log in again.');
        return;
      }
  
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.authService.updatePassword(Number(userId), currentPassword, newPassword).subscribe(
        (response: any) => {
          console.log('Password updated successfully', response);
          this.activeModal.close();
        },
        (error: any) => {
          console.error('Password update failed', error);
          alert('Password update failed. Please try again.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
 

}

  
