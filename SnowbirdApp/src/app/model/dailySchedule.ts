import { Employee } from "./employee";

export class DailySchedule {
    date: Date; // primary key
    attenders: Employee[];

    constructor(date, attenders) {
        this.date = date;
        this.attenders = attenders;
    }
}