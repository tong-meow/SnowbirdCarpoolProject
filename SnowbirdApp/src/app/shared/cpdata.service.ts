import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import * as firebase from 'firebase/compat';
// import * as firestore from 'firebase/firestore';
// import 'firebase/firestore';
import { CarpoolComponent } from '../components/carpool/carpool.component';
import { Carpool } from '../model/carpool';
import { collection, doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})

export class CpdataService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor(private afs: AngularFirestore) { }

  // Add carpool
  addCarpool(carpool: Carpool) {
    carpool.id = this.afs.createId();
    console.log("new carpool has id: "+ carpool.id);
    return this.afs.collection('/Carpools').add(carpool);

    // carpool.id = this.afs.createId();
    // this.afs.collection("/Carpools").doc(carpool.id).set({
    //   driver: carpool.driver,
    //   passengers: carpool.passengers,
    //   startTime: carpool.startTime,
    //   totalSeats: carpool.totalSeats   
    // });
    
  }

  // Get all carpools
  getAllCarpools() {
    return this.afs.collection('/Carpools').snapshotChanges();
  }

  // Delete carpool
  deleteCarpool(carpool: Carpool) {
    return this.afs.doc('/Carpools/'+carpool.id).delete();
  }

  // Update carpool time
  updateCarpoolTime(carpool: Carpool, newVal: string) {
    return this.afs.doc('/Carpools/'+carpool.id).update({startTime: newVal});
  }

  // Update carpool passengers
  updateCarpoolPassengers(carpool: Carpool, newVal: string[]) {
    return this.afs.doc('/Carpools/'+carpool.id).update({passengers: newVal});
    // Overwrite data:
    // return this.afs.doc('Carpools/'+carpool.id).set({
    //   driver: carpool.driver,
    //   id: carpool.id,
    //   passengers: newVal,
    //   startTime: carpool.startTime,
    //   totalSeats: carpool.totalSeats    
    //   });
  }
  // Firestore data converter
  carpoolConverter = {
    toFirestore: (cp: Carpool) => {
        return {
            driver: cp.driver,
            id: cp.id,
            passengers: cp.passengers,
            startTime: cp.startTime,
            totalSeats: cp.totalSeats
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Carpool(data.id, data.driver, data.passengers, data.startTime, data.totalSeats);
    }
  };

  // Get Carpool from Firestore using converter
  async getCarpoolWithId(carpoolId: string) {
  
    const docRef = doc(this.db, "Carpools", carpoolId).withConverter(this.carpoolConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Convert to Carpool object
      console.log(docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() is undefined in this case
      console.log("No such document!");
    }
  }

  // GetCarpool - version with no converter
  // async getCarpoolWithId(carpoolId: string) {
  
  //   const docRef = doc(this.db, "Carpools", carpoolId);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     // docSnap is a map?
  //     console.log("Document data:", docSnap.data());
  //     return docSnap.data();
  //   } else {
  //     // doc.data() is undefined in this case
  //     console.log("No such document!");
  //   }
  // }

}
