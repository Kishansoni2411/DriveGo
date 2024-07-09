import { Component, OnInit } from '@angular/core';
import { Router , RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../authentication/login/login.component';
import { SignupComponent } from '../../authentication/signup/signup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})




export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string = '';      
  username: string = ''; 

  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  openModal(val: string) {
    if (val === "signup") {
      this.modalService.open(SignupComponent, { centered: true });
    } else if (val === "login") {
      this.modalService.open(LoginComponent, { centered: true });
    }
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    if (token != null) {
      this.isLoggedIn = true;
      this.username = localStorage.getItem('username') || '';
      this.role = localStorage.getItem('userRoleId') || '';
    } else {
      this.isLoggedIn = false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoleId');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }

  profile(){
    this.router.navigate(['/profile']);
  }
}
