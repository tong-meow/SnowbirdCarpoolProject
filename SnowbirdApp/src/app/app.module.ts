import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment.prod';

import { AppComponent } from './app.component';
import { CarpoolComponent } from './components/carpool/carpool.component';
import { CarpoolsComponent } from './components/carpools/carpools.component';
import { AddcarpoolComponent } from './components/addcarpool/addcarpool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { UserComponent } from './user/user.component';
// import { LogInComponent } from './log-in/log-in.component';
// import { CarpoolDetailsComponent } from './carpool-details/carpool-details.component';
import { PlatformModule } from '@angular/cdk/platform';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { CarpoolDetailsComponent } from './components/carpool-details/carpool-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { ProfileComponent } from './components/profile/profile.component';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { ApproveUsersComponent } from './components/admin-compo/approve-users/approve-users.component';
import { AccountToBeApprovedComponent } from './components/admin-compo/account-to-be-approved/account-to-be-approved.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

// routes are stored as an array, each element is a JS object
const appRoutes: Routes = [
  // path: what get entered in the url after the domain, e.g. localhost:4200/user
  { path: '', pathMatch:'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent }, // Google login
  { path: 'carpools', component: CarpoolsComponent }, // daily carpools
  { path: 'carpools/:id', component: CarpoolDetailsComponent }, // one carpool
  { path: 'profile', component:ProfileComponent }, // user profile
  { path: 'editprofile', component: EditProfileComponent }, // edit profile
  { path: 'editvehicle', component: EditVehicleComponent },
  { path: 'approveusers', component: ApproveUsersComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CarpoolComponent,
    CarpoolsComponent,
    AddcarpoolComponent,
    CarpoolDetailsComponent,
    EditProfileComponent,
    LogInComponent,
    NavbarComponent,
    ProfileComponent,
    EditVehicleComponent,
    ApproveUsersComponent,
    AccountToBeApprovedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    RouterModule.forRoot(appRoutes),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    PlatformModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
