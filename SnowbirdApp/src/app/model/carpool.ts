import { Vehicle } from "./vehicle";

export class Carpool {
    id: string;
    driver: string;
    passengers: string[];
    date: Date;
    startTime: string; 
    arrivalTime: string;
    direction: string;
    vehicle: Vehicle;
    totalSeats: number;
    hasStarted: boolean;

    constructor(id, driver, passengers, date, startTime, arrivalTime, direction, vehicle, totalSeats, hasStarted) {
        this.id = id;
        this.driver = driver;
        this.passengers = passengers;
        this.date = date;
        this.startTime = startTime;
        this.arrivalTime = arrivalTime;
        this.direction = direction;
        this.vehicle = vehicle;
        this.totalSeats = totalSeats;
        this.hasStarted = hasStarted;
    }
}
