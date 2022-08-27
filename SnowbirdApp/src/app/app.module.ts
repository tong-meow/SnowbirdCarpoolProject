import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CarpoolComponent } from './carpool/carpool.component';
import { CarpoolsComponent } from './carpools/carpools.component';

@NgModule({
  declarations: [
    AppComponent,
    CarpoolComponent,
    CarpoolsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
