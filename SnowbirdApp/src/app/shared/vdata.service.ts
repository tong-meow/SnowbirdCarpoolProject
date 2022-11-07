import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
// models
import { Vehicle } from '../model/vehicle';
// services
import { UdataService } from './udata.service';
import { TransferService } from './transfer.service';

@Injectable({
    providedIn: 'root'
})

export class VdataService {

    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);
    
    constructor(private afs: AngularFirestore,
                private udataService: UdataService,
                private transferService: TransferService) { }


    async addVehicle(v: Vehicle) {
        return this.afs.collection('/Vehicles').doc(v.license)
        .set({ 
            license: v.license,
            uid: v.uid,
            nickname: v.nickname,
            make: v.make,
            model: v.model,
            seatsAvail: v.seatsAvail
        })
        .then(res => {
            console.log("Vehicle added: " + v.nickname);
        })
        .catch(error => {
            console.log("[VDATA SERVICE] " + error);
        });
    }

    async updateVehicle(v: Vehicle) {
        await this.afs.collection('/Vehicles').doc(v.license).update({
            license: v.license,
            uid: v.uid,
            nickname: v.nickname,
            make: v.make,
            model: v.model,
            seatsAvail: v.seatsAvail
        }).then(res => {

        }).catch(error => {
            console.log("[UDATA SERVICE] " + error);
        });
    }

    async getVehicle(id: string) {
        var v: Vehicle;
        const usersRef = collection(this.db, "Vehicles");
        const q = query(usersRef, where("license", "==", id));
        await getDocs(q).then(res => {
            if (res.size != 0) {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    v = {
                        license: doc['license'],
                        uid: doc['uid'],
                        nickname: doc['nickname'],
                        make: doc['make'],
                        model: doc['model'],
                        seatsAvail: doc['seatsAvail']
                    };
                    console.log("[VDATA SERVICE] Vehicle found.");
                }
                this.transferService.setData(v);
            }
        })
        .catch(error => {
            console.log("[VDATA SERVICE] " + error);
        });
    }

    async deleteVehicle(v: Vehicle){
        await this.afs.doc('/Vehicles/' + v.license).delete()
        .then(() => {
            console.log("[VDATA SERVICE] Vehicle deleted.");
        })
        .catch(error => {
            console.log(error);
        })
    }

    // get all vehicles that belongs to the current user
    async getAllVehicles(){
        var vehicles: Vehicle[] = [];
        var v: Vehicle;
        const acRef = collection(this.db, "Vehicles");
        const q = query(acRef, where("uid", "==", this.udataService.user.uid));
        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[VDATA SERVICE] No vehicles found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    v = {
                        license: doc['license'],
                        uid: doc['uid'],
                        nickname: doc['nickname'],
                        make: doc['make'],
                        model: doc['model'],
                        seatsAvail: doc['seatsAvail']
                    };
                    console.log("[VDATA SERVICE] Vehicle found: " + v.nickname);
                    vehicles.push(v);
                }
                this.transferService.setData(vehicles);
            }
        })
        .catch(error => {
            console.log("[VDATA SERVICE] " + error);
        });
    }
}