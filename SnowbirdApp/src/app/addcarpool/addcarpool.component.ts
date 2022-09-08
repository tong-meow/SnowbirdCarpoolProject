import { Component, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-addcarpool',
  templateUrl: './addcarpool.component.html',
  styleUrls: ['./addcarpool.component.css']
})
export class AddcarpoolComponent implements OnInit {
  @Output() newCarpool = new EventEmitter<{driver: string, passengers: string[], startTime: string, totalSeats: number}>();
  carpoolCreated = false;
  // carpoolDate = ;
  totalSeats = 4;
  // carpoolPlaceholder = 0;
  carpools = [];

  constructor() { }

  ngOnInit(): void {
  }

  onCreateCarpool(nameInput:HTMLInputElement, timeInput:HTMLInputElement, seatsInput:HTMLInputElement) {
    this.carpoolCreated = true;
    // this.carpoolPlaceholder += 1;
    // this.carpools.push(this.carpoolPlaceholder);

    this.newCarpool.emit({
      driver: nameInput.value,
      passengers: [],
      startTime: timeInput.value,
      totalSeats: Number(seatsInput.value)
    });
  }

  // onAddServer(nameInput: HTMLInputElement) {
  //   this.serverCreated.emit({
  //     serverName: nameInput.value,
  //     serverContent: this.serverContentInput.nativeElement.value
  //   });
  // }

}
