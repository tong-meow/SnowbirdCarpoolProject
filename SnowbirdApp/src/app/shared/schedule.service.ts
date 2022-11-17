import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
// models
import { DailySchedule } from '../model/dailySchedule';
// services
import { UdataService } from './udata.service';
import { TransferService } from './transfer.service';

@Injectable({
    providedIn: 'root'
})

export class ScheduleService {

    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);
    
    constructor(private afs: AngularFirestore,
                private udataService: UdataService,
                private transferService: TransferService) { }

    async addSchedule(ds: DailySchedule, docTitle: string) {
        // console.log("START ADDING: " + docTitle + " " + ds.date);
        return this.afs.collection('/Schedule').doc(docTitle)
            .set({ 
                date: ds.date,
                attenders: ds.attenders
            })
            .then(res => {
                console.log("Daily Schedule added: " + docTitle);
            })
            .catch(error => {
                console.log("[SCHEDULE SERVICE] " + error);
            });
    }

    async getScheduleByDate(date: Date){
        var ds: DailySchedule;
        // fetch from the db
        const schRef = collection(this.db, "Schedule");
        const q = query(schRef, where("date", "==", date));
        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[SCHEDULE SERVICE] No data found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    ds = {
                        date: doc["date"],
                        attenders: doc["attenders"]
                    };
                    console.log("[SCHEDULE SERVICE] Schedule found: " + ds.date);
                }
                this.transferService.setData(ds);
            }
        })
        .catch(error => {
            console.log("[GUDATA SERVICE] " + error);
        });
    }

    async getScheduleByTimePeriod(start: Date, end: Date){
        var schedule: DailySchedule[] = [];
        var ds: DailySchedule;
        const schRef = collection(this.db, "Schedule");
        const q = query(schRef, where("date", ">=", start), where("date", "<=", end));

        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[SCHEDULE SERVICE] No data found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    var timestamp = doc["date"];
                    ds = {
                        date: new Date(timestamp.seconds*1000),
                        attenders: doc["attenders"]
                    };
                    schedule.push(ds);
                    console.log("[SCHEDULE SERVICE] Schedule found: " + ds.date);
                }
                this.transferService.setData(schedule);
            }
        })
        .catch(error => {
            console.log("[GUDATA SERVICE] " + error);
        });
    }
}