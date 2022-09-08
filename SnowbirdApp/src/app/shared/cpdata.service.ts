import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CarpoolComponent } from '../carpool/carpool.component';
import { Carpool } from '../model/carpool';

@Injectable({
  providedIn: 'root'
})
export class CpdataService {

  constructor(private afs: AngularFirestore) { }

  // Add carpool
  addCarpool(carpool: Carpool) {
    carpool.id = this.afs.createId();
    return this.afs.collection('/Carpools').add(carpool);
  }

  // Get all carpools
  getAllCarpools() {
    return this.afs.collection('/Carpools').snapshotChanges();
  }

  // Delete carpool
  deleteCarpool(carpool: Carpool) {
    return this.afs.doc('/Carpools/'+carpool.id).delete();
  }

  // Update carpool
  updateCarpool(carpool: Carpool) {
    this.deleteCarpool(carpool);
    this.addCarpool(carpool);
  }
}
