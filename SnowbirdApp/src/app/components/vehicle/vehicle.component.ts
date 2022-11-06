import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "../../model/googleAccount";
import { User } from '../../model/user';
import { Vehicle } from 'src/app/model/vehicle';
// services
import { GudataService } from '../../shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { LocalService } from 'src/app/shared/local.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { VdataService } from 'src/app/shared/vdata.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})

export class VehicleComponent implements OnInit {

  @Input() vehicleObj: Vehicle;
  @Output() vehicleDeleted = new EventEmitter<{license: string}>();

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private localService: LocalService,
              private transferService: TransferService,
              private vdataService: VdataService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onDelete(){
    if (window.confirm('Delete this vehicle?')) {
      this.vdataService.deleteVehicle(this.vehicleObj).then(() => {
        this.vehicleDeleted.emit({license: this.vehicleObj.license});
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  onEdit(){
    // edit vehicle
  }
}
