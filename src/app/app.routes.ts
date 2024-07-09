import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { CarComponent } from './features/pages/cars/cars.component';

import { PagenotfoundComponent } from './features/pages/pagenotfound/pagenotfound.component';
import { CarDetailsComponent } from './features/pages/cardetails/cardetails.component';
import { MylistingsComponent } from './features/pages/mylistings/mylistings.component';
import { CarActionsComponent } from './features/pages/caractions/caractions.component';
import { LoginComponent } from './features/authentication/login/login.component';
import { SignupComponent } from './features/authentication/signup/signup.component';
import { ProfileComponent } from './features/authentication/profile/profile.component';
import { ChatmessageComponent } from './features/pages/chatmessage/chatmessage.component';
import { AboutComponent } from './features/pages/about/about.component';
import { authGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { AdmindashboardComponent } from './features/adminpages/admindashboard/admindashboard.component';
import { AdmincarsComponent } from './features/adminpages/admincars/admincars.component';
import { AdminusersComponent } from './features/adminpages/adminusers/adminusers.component';
import { AdminreviewComponent } from './features/adminpages/adminreview/adminreview.component';


export const routes: Routes = [
    { path: '', redirectTo:'/home',pathMatch:'full' },
    { path: 'login',component:LoginComponent},
    { path: 'signup',component:SignupComponent},
    { path: 'profile', component: ProfileComponent ,canActivate: [authGuard]},


   
    { path: 'home', component: HomeComponent },
  
    { path: 'about', component: AboutComponent },
    { path: 'cars', component: CarComponent},
    { path: 'chatmessages', component:ChatmessageComponent ,canActivate: [authGuard]},
    { path: 'listing', component:MylistingsComponent ,canActivate: [authGuard]},
    { path: 'add-car', component:CarActionsComponent ,canActivate: [authGuard]},
    { path: 'action-car/:carId', component:CarActionsComponent ,canActivate: [authGuard]},
    { path: 'car-details/:carId', component: CarDetailsComponent ,canActivate: [authGuard]},
    { 
        path: 'admin', 
        canActivate: [AdminGuard],  // Protect the admin route with AdminGuard
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'dashboard', component: AdmindashboardComponent },
            { path: 'cars', component: AdmincarsComponent },
            { path: 'users', component: AdminusersComponent },
            { path: 'reviews', component: AdminreviewComponent },
        ]
    },
    { path: '**' , component:PagenotfoundComponent}


   
];
