import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationService } from '../../../services/authentication.service';
import { UserModel } from '../../../model/UserModel'; // Adjust the path as needed

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthenticationService // Inject AuthenticationService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { passwordMismatch: true };
  };

  signup() {
    alert("Called ..... ");
    console.log(this.signupForm);
    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      const user: UserModel = {
        username: formValues.username,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        userEmail: formValues.email,
        address: formValues.address,
        password: formValues.password, // Only include password, not confirmPassword
        phoneNumber: formValues.phoneNumber
      };
      console.log(user);

      this.authService.signup(user).subscribe(
        (response:any) => {
          console.log('Signup Successful:', response);
          // Handle successful signup, perhaps close the modal
          this.close();
        },
        (error:any) => {
          console.log('Signup Failed:', error);
          // Handle error (e.g., show error message to the user)
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
