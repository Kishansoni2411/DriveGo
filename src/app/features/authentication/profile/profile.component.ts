import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpatepasswordComponent } from '../upatepassword/upatepassword.component';

interface UserModel {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  address: string;
  password: string | null;
  phoneNumber: string;
  userRoleId: number;

}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserModel | null = null;
  profileForm: FormGroup;
  isEditing: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.profileForm = this.fb.group({
      userId: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }, Validators.required],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      userEmail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      address: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
    
    });
  }

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId !== null) {
      this.authService.getUserDetails(userId).subscribe({
        next: (data: UserModel) => {
          this.user = data;
          this.patchUserData(); // Use a separate method to handle the patching
        },
        error: (error: any) => {
          this.errorMessage = 'Error fetching user details';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'User ID not found in localStorage';
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userid');
    if (userIdString) {
      const userIdNumber = Number(userIdString);
      if (!isNaN(userIdNumber)) {
        return userIdNumber;
      }
    }
    return null;
  }

  patchUserData(): void {
    if (this.user) {
      this.profileForm.patchValue(this.user); // Only patch if user is not null
    }
  }

  enableEditing(): void {
    this.isEditing = true;
    this.profileForm.enable(); // Enable all form controls
    this.profileForm.get('userId')?.disable(); // Keep the userId field disabled
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.patchUserData(); // Revert changes
    this.profileForm.disable(); // Disable form controls
  }

  submitProfile(): void {
    if (this.profileForm.valid) {
      this.authService.updateUserDetails(this.profileForm.getRawValue()).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.isEditing = false;
          this.profileForm.disable();
        },
        error: (error: any) => {
          if (error.status === 409) {
            this.errorMessage = error.error.Message;  // Specific conflict message from the server
          } else if (error.status === 404) {
            this.errorMessage = 'User not found or update failed';
          } else {
            this.errorMessage = 'An error occurred while updating the profile';
          }
          console.error(error);
        }
      });
    }
  }
  changePassword(): void {
    alert("called");
    this.modalService.open(UpatepasswordComponent, { centered: true });
    
  }
  // openModal(val: string) {
  //   if (val === "signup") {
  //     this.modalService.open(SignupComponent, { centered: true });
  //   } else if (val === "login") {
  //     this.modalService.open(LoginComponent, { centered: true });
  //   }
  // }
  
}
