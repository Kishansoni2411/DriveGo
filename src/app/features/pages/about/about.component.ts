import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../services/review.service';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  reviewForm!: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {}

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
        alert('User ID not found. Please log in.');
        return;
      }

      const review = { userid: parseInt(userId, 10), rating, description };

      this.reviewService.addReview(review).subscribe(
        (response: any) => {
          console.log('Review submitted successfully', response);
          alert('Thank you for your review!');
          this.reviewForm.reset();
        },
        (error: any) => {
          console.error('Failed to submit review', error);
          alert('Failed to submit review. Please try again.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
