import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carpools',
  templateUrl: './carpools.component.html',
  styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {
  carpoolCreated = false;
  // newCarpool = 0;
  carpools = [];

  constructor() { }

  ngOnInit(): void {
  }

  // onCreateCarpool() {
  //   this.carpoolCreated = true;
  //   this.newCarpool += 1;
  //   this.carpools.push(this.newCarpool);
  // }

}
