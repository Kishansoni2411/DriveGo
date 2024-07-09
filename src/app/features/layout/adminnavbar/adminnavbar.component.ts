import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminnavbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent {
  // You can add any logic needed for the admin navbar here
}
