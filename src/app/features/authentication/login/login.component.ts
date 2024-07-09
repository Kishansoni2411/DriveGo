import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';
import { SignupComponent } from '../signup/signup.component';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: any;
  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthenticationService) {}

    ngOnInit()
    {
      this.loginForm = this.fb.group({
      username: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }
 
 
  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response:any) => {
          console.log('Login successful', response);
          this.activeModal.close();
          window.location.href = '/'; 
          // this.router.navigate(['/']); 
        },
        (error:any) => {
          console.error('Login failed', error);
          alert('Login failed. Please check your credentials.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }


  openModal(val: string) {
    if (val === "signup") {
      this.close()
      this.modalService.open(SignupComponent, { centered: true });
    } else if (val === "forgotPassword") {
      this.close()
      this.modalService.open(ForgotpasswordComponent, {  centered: true });
    }
  }
  close() {
    this.activeModal.dismiss();
  }
}
