import { AngularFireModule } from  '@angular/fire/compat';
import { AngularFirestoreModule } from  '@angular/fire/compat/firestore';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CarpoolComponent } from './carpool/carpool.component';
import { CarpoolsComponent } from './carpools/carpools.component';
import { AddcarpoolComponent } from './addcarpool/addcarpool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CarpoolComponent,
    CarpoolsComponent,
    AddcarpoolComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCffpakW61B09VD3_JNeY7gmT0VI_0bXD8",
      authDomain: "snowbirdapp-stjw.firebaseapp.com",
      projectId: "snowbirdapp-stjw",
      storageBucket: "snowbirdapp-stjw.appspot.com",
      messagingSenderId: "222989992990",
      appId: "1:222989992990:web:795f54c25d473c57511a0f",
      measurementId: "G-RDH04ZZ94F"
    }),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
