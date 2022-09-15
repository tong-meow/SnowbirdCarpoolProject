import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment.prod';

import { AppComponent } from './app.component';
import { CarpoolComponent } from './carpool/carpool.component';
import { CarpoolsComponent } from './carpools/carpools.component';
import { AddcarpoolComponent } from './addcarpool/addcarpool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './user/user.component';
import { LogInComponent } from './log-in/log-in.component';
import { CarpoolDetailsComponent } from './carpool-details/carpool-details.component';

// routes are stored as an array, each element is a JS object
const appRoutes: Routes = [
  // path: what get entered in the url after the domain, e.g. localhost:4200/user
  { path: '', pathMatch:'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent }, // current main page: daily carpools
  { path: 'carpools', 
    component: CarpoolsComponent,
    // children: [
    //   {
    //     // path: ':id',
    //     path: '1',
    //     component: CarpoolDetailsComponent,
    //   },
    // ]
 },
  { path: 'carpools/:id', component: CarpoolDetailsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CarpoolComponent,
    CarpoolsComponent,
    AddcarpoolComponent,
    CarpoolDetailsComponent,
    UserComponent,
    LogInComponent
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
