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

    
    async addVehicle(vehicle: Vehicle) {

    }

    async updateVehicle(vehicle: Vehicle) {

    }

    async getVehicle(id: string) {

    }

    async deleteVehicle(id: string){

    }
}