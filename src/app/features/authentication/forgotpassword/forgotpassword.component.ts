// forgotpassword.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'] // Corrected styleUrls from styleUrl
})
export class ForgotpasswordComponent {
  currentStep: number = 1; // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  resetPasswordForm: FormGroup;
  emailErrorMessage: string | null = null; // Variable to store email validation error message

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService, // Inject AuthenticationService
    public activeModal: NgbActiveModal
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
    
  }

  submitEmail() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.validateUserEmail(email).subscribe(
        (Response:any) => {
          if (Response.exists) {
            // Email exists, proceed to the next step
            this.currentStep = 2;
          } else {
            // Email does not exist, show an error message
            this.emailErrorMessage = 'Email does not exist.';
          }
        },
        (error:any) => {
          // Handle error, for example, show a general error message
          this.emailErrorMessage = 'An error occurred while validating the email. Please try again later.';
        }
      );
    }
  }

  submitOTP() {
    if (this.otpForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      const otp = this.otpForm.get('otp')?.value;

      this.authService.validateOtp(email, otp).subscribe(
        (response:any) => {
          if (response.valid) {
            console.log(response.Message);
            this.currentStep = 3; // Update to next step or action
          } else {
            console.log(response.Message);
            alert('Invalid OTP');
          }
        },
        (error:any) => {
          console.error('Error:', error);
          alert('An error occurred while validating the OTP.');
        }
      );
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.get('password')?.value;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.resetUserPassword(email , password).subscribe(
        (Response:any) => {
          if (Response.Reset) {
            alert("Password Updated Successfully ..... ");
            this.close();
          } else {
            
            this.emailErrorMessage = 'An error occurred while validating the email.';
          }
        },
        (error:any) => {
          // Handle error, for example, show a general error message
          this.emailErrorMessage = 'An error occurred while validating the email. Please try again later.';
        }
      );
      
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
