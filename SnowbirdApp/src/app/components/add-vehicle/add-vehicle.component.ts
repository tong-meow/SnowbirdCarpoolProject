import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { getFirestore } from "firebase/firestore";
// services
import { UdataService } from 'src/app/shared/udata.service';
import { VdataService } from 'src/app/shared/vdata.service';
import { TransferService } from 'src/app/shared/transfer.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  @Input() uid: String;
  @Output() vehicleAdded = new EventEmitter<{license:String}>();

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor(private udataService: UdataService,
              private vdataService: VdataService,
              private transferService: TransferService) { }

  ngOnInit(): void { }

  async onSaveCar(nickname: HTMLInputElement, make: HTMLInputElement, model: HTMLInputElement, 
            license: HTMLInputElement, color: HTMLInputElement, seats: HTMLInputElement){
    if (license.value == '' || seats.value == '') {
      alert('Please fill in the car license and number of seats available.');
      return;
    }

    await this.vdataService.getVehicle(license.value).then(res => {
      var checkV = this.transferService.getData();
      this.transferService.clearData();
      if (checkV != undefined) {
        alert('A vehicle with the same license already exists in the database. Please double check your input.');
        return;
      }

      var v = {
        uid : this.udataService.user.uid,
        nickname : nickname.value,
        make : make.value.toUpperCase(),
        model : model.value,
        license : license.value.toUpperCase(),
        color: color.value,
        seatsAvail : Number(seats.value)
      }

      // add to db
      this.vdataService.addVehicle(v).then(res => {
        // emit to parent: profile component
        this.vehicleAdded.emit({license: license.value});
      });
    })
    .catch(error => {
      console.log(error);
    })
  }

  onCancel(){
    this.vehicleAdded.emit({license: ""});
  }
}
