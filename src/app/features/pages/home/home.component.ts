import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  images = [
    'assets/Photos/heroImg2.jpg' , 
    'assets/Photos/heroImg3.jpg',
    'assets/Photos/heroImg4.jpg',
    'assets/Photos/heroImg5.jpg',
    'assets/Photos/heroImg6.jpg',
    'assets/Photos/heroImg7.jpg'
    
  ];

  

}
