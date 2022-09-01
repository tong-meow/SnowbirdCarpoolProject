import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CarpoolComponent } from './carpool/carpool.component';
import { CarpoolsComponent } from './carpools/carpools.component';
import { UserComponent } from './user/user.component';

// routes are stored as an array, each element is a JS object
const appRoutes: Routes = [
  // path: what get entered in the url after the domain, e.g. localhost:4200/user
  { path: '', component: CarpoolsComponent }, // current main page: daily carpools
  { path: 'user', component: UserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CarpoolComponent,
    CarpoolsComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
