import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import * as firebase from 'firebase/compat';
// import * as firestore from 'firebase/firestore';
// import 'firebase/firestore';
import { CarpoolComponent } from '../components/carpool/carpool.component';
import { Carpool } from '../model/carpool';
import { User } from '../model/user';
import { collection, doc, setDoc, getDoc, getFirestore, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { TransferService } from './transfer.service';


@Injectable({
  providedIn: 'root'
})

export class CpdataService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor(private afs: AngularFirestore, 
              private transferService: TransferService) { }

  // Add carpool
  async addCarpool(carpool: Carpool) {
    // carpool.id = this.afs.createId();
    // console.log("new carpool has id: "+ carpool.id);
    // return this.afs.collection('/Carpools').add(carpool);
    var cpID = "";
    await this.afs.collection('/Carpools').add(carpool)
      .then(function(docRef) {
        // console.log("Carpool doc created with ID: ", docRef.id);
        cpID = docRef.id;
      })
      .then(() => {
        this.afs.doc('/Carpools/'+cpID).update({id: cpID});
      })
  
  }

  // Get all carpools
  getAllCarpools() {
    return this.afs.collection('/Carpools').snapshotChanges();
  }

  async getAllCarpoolsFromDate(date: Date) {
        var cps: Carpool[] = [];
        var cp: Carpool;
        const cpRef = collection(this.db, "Carpools");
        const q = query(cpRef, where("date", "==", date));
        await getDocs(q).then(res => {
            if (res.size == 0) {
                // console.log("[CPDATA SERVICE] No carpools on " + date + ".");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    cp = {
                      id: doc["id"],
                      driver: doc["driver"],
                      passengers: doc["passengers"],
                      date: doc["date"],
                      startTime: doc["startTime"],
                      arrivalTime: doc["arrivalTime"],
                      direction: doc["direction"],
                      vehicle: doc["vehicle"],
                      totalSeats: doc["totalSeats"],
                      hasStarted: doc["hasStarted"]
                  };
                  // console.log("[CPDATA SERVICE] Carpool found.");
                  cps.push(cp)
              }
              this.transferService.setData(cps);
          }
      })
      .catch(error => {
          console.log("[CPDATA SERVICE] " + error);
      });
  }

  // Delete carpool
  async deleteCarpool(carpool: Carpool) {
    await this.afs.doc('/Carpools/'+carpool.id).delete();
    // console.log("Carpool deleted: " + carpool.id);
  }

  // Update carpool time
  async updateCarpoolTime(carpool: Carpool, newVal: Date) {
    await this.afs.doc('/Carpools/'+carpool.id).update({startTime: newVal});
  }

  // Update carpool passengers
  async updateCarpoolPassengers(carpool: Carpool, newVal: string[]) {
    await this.afs.doc('/Carpools/'+carpool.id).update({passengers: newVal});

    // // Overwrite data:
    // await this.afs.doc('Carpools/'+carpool.id).set({
    //   passengers: newVal,   
    //   });
    // console.log("[CPDATA SERVICE] Updated carpool with id: " + carpool.id);

  }

  // Add carpool passenger
  async addCarpoolPassenger(carpoolId: string, newPassengerId: string) {

    const cpRef = doc(this.db, "Carpools", carpoolId);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(cpRef, {
      passengers: arrayUnion(newPassengerId)
    });
    // console.log("[CPDATA SERVICE] Added passenger to : " + carpoolId);
  }

  // Add carpool passenger
  async removeCarpoolPassenger(carpool: Carpool, newPassengerId: string) {

    const cpRef = doc(this.db, "Carpools", carpool.id);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(cpRef, {
      passengers: arrayRemove(newPassengerId)
    });
    // console.log("[CPDATA SERVICE] Removed passenger from : " + carpool.id);
  }

  // Firestore data converter
  carpoolConverter = {
    toFirestore: (cp: Carpool) => {
        return {
            id: cp.id,
            driver: cp.driver,
            passengers: cp.passengers,
            date: cp.date,
            startTime: cp.startTime,
            arrivalTime: cp.arrivalTime,
            direction: cp.direction,
            vehicle: cp.vehicle,
            totalSeats: cp.totalSeats,
            hasStarted: cp.hasStarted
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        var date = new Date(data.date.seconds * 1000);
        return new Carpool(data.id,
                           data.driver, 
                           data.passengers, 
                           date, 
                           data.startTime, 
                           data.arrivalTime, 
                           data.direction, 
                           data.vehicle,
                           data.totalSeats,
                           data.hasStarted);
    }
  };

  // Get Carpool from Firestore using converter
  async getCarpoolWithId(carpoolId: string) {
  
    const docRef = doc(this.db, "Carpools", carpoolId).withConverter(this.carpoolConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Convert to Carpool object
      // console.log(docSnap.data());
      return docSnap.data();
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

  async checkUserStatus(uid: string, date: Date){
    var cps: Carpool[] = [];
  }

  async updateCarpoolStatus(id: string, status: boolean){
    await this.afs.doc('/Carpools/'+id).update({hasStarted: status});
  }
}
