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
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { CarpoolDetailsComponent } from './components/carpool-details/carpool-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// routes are stored as an array, each element is a JS object
const appRoutes: Routes = [
  // path: what get entered in the url after the domain, e.g. localhost:4200/user
  { path: '', pathMatch:'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent }, // Google login
  { path: 'carpools', component: CarpoolsComponent }, // daily carpools
  { path: 'carpools/:id', component: CarpoolDetailsComponent }, // one carpool
  { path: 'editprofile', component: EditProfileComponent }, // user profile
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
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
