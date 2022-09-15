export class Carpool {
    id: string;
    driver: string;
    passengers: string[]; 
    startTime: string; 
    totalSeats: number;

    constructor(id, driver, passengers, startTime, totalSeats) {
        this.id = id;
        this.driver = driver;
        this.passengers = passengers;
        this.startTime = startTime;
        this.totalSeats = totalSeats;
    }
}
