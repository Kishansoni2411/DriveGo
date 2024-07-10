import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  reviewForm!: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService , private toaster: ToastrService) {}

  ngOnInit() {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', [Validators.required]]
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const { rating, description } = this.reviewForm.value;
      const userId = localStorage.getItem('userid'); // Retrieve the user ID from local storage

      if (!userId) {
        this.toaster.error("User ID not found. Please log in..","Error");
        
        return;
      }

      const review = { userid: parseInt(userId, 10), rating, description };

      this.reviewService.addReview(review).subscribe(
        (response: any) => {
          
          console.log('Review submitted successfully', response);
          this.toaster.info("Thank you for your review!","info");
         
          this.reviewForm.reset();
        },
        (error: any) => {
          console.error('Failed to submit review', error);
          this.toaster.error("Failed to submit review. Please try again...","Error");
        
        }
      );
    } else {
      this.toaster.error("Form is invalid","Error");
     
    }
  }
}
