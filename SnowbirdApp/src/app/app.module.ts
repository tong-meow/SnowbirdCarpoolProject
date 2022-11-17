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
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { ApproveUsersComponent } from './components/admin-compo/approve-users/approve-users.component';
import { AccountToBeApprovedComponent } from './components/admin-compo/account-to-be-approved/account-to-be-approved.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NoticeComponent } from './components/notice/notice.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { CalendarComponent } from './components/calendar/calendar/calendar.component';
import { ImportFileComponent } from './components/calendar/import-file/import-file.component';
import { EmployeeComponent } from './components/calendar/employee/employee.component';
import { AddScheduleComponent } from './components/calendar/add-schedule/add-schedule.component';
import { ScheduleComponent } from './components/calendar/schedule/schedule.component';

// routes are stored as an array, each element is a JS object
const appRoutes: Routes = [
  // path: what get entered in the url after the domain
  { path: '', pathMatch:'full', redirectTo: 'carpools' },
  { path: 'login', component: LogInComponent }, // Google login
  { path: 'carpools', component: CarpoolsComponent }, // daily carpools
  { path: 'carpools/:id', component: CarpoolDetailsComponent }, // one carpool
  { path: 'profile', component:ProfileComponent }, // user profile
  { path: 'editprofile', component: EditProfileComponent }, // edit profile
  { path: 'approveusers', component: ApproveUsersComponent },
  { path: 'notice', component: NoticeComponent},
  { path: 'calendar', component: CalendarComponent}
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
    AddVehicleComponent,
    ApproveUsersComponent,
    AccountToBeApprovedComponent,
    NoticeComponent,
    VehicleComponent,
    CalendarComponent,
    ImportFileComponent,
    EmployeeComponent,
    AddScheduleComponent,
    ScheduleComponent
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
