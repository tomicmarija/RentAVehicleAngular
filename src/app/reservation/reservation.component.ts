import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from '../services/server.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Dates } from '../models/date.model';

import OlMap from 'ol/map';
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';
import OlView from 'ol/view';
import OlProj from 'ol/proj';
import { MapInfo } from '../models/mapInfo.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  styles: ['agm-map {height: 400px; width: 920px;}'] //ovde postavljamo sirinu i visinu mape
})
export class ReservationComponent implements OnInit {

  serviceId: number;
  id: number;
  vehicle: any;
  priceItem: any;
  branches: Observable<any>;
  selectedStartBranch: string;
  selectedEndBranch: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  dateNow: Date;
  date: any;
  first: any;
  second: any;
  dateEnd: Date;
  freeDates: Dates[] = [];
  selectedDate: Dates;
  reservations: Reservation[] = [];
  show: Boolean;

  constructor(private serverService: ServerService, private router: ActivatedRoute) { 
    router.params.subscribe(params => {this.id = params["id"]});
    router.params.subscribe(params => {this.serviceId = params["serviceId"]});
  }

  ngOnInit() {
    this.callGetVehicle();
    this.callGetBranches();
    this.callGetPriceItem();
    this.callGetReservations();
    this.show = true;
  }

  callGetVehicle(){
    this.serverService.getVehicle(this.id)
    .subscribe(
      data => {
        this.vehicle = data;
      },
      err => {
        console.log(err);
      }
    )
  }

  callGetPriceItem(){
    this.serverService.getPriceItem(this.id)
    .subscribe(
      data => {
        this.priceItem = data;
      },
      err => {
        console.log(err);
      }
    )
  }

  callGetBranches(){
    this.serverService.getServiceBranches(this.serviceId)
    .subscribe(
      data => {
        this.branches = data;
        this.startLatitude = this.branches[0].Latitude;
        this.startLongitude = this.branches[0].Longitude;
        this.endLatitude = this.branches[0].Latitude;
        this.endLongitude = this.branches[0].Longitude;
        this.selectedStartBranch = this.branches[0].Id;
        this.selectedEndBranch = this.branches[0].Id;
      },
      err => {
        console.log(err);
      }

    )
  }

  callGetReservations(){
    this.serverService.getReservations(this.id)
    .subscribe(
      data => {
        this.reservations = data;
        this.findFirstDate();
        if(this.freeDates.length > 0){
          this.selectedDate = this.freeDates[0];
          this.dateNow = this.selectedDate.startDate;
          this.dateEnd = this.dateNow;
        }
        
      },
      err => {
        console.log(err);
      }
    )
  }

  findFirstDate(){
    this.dateNow = new Date();

    if(this.reservations.length == 0)
    {
      this.dateEnd = new Date(2050, 12, 31);
      this.freeDates.push(new Dates(this.dateNow, this.dateEnd));
    }
    else{
   
      for(var i = 0; i < this.reservations.length; i++){
        this.first = Date.parse(this.reservations[i].StartDate.toString());
        this.second = Date.parse(this.reservations[i].EndDate.toString());
        this.date = Date.parse(this.dateNow.toString());

        if(i == 0){
          if(this.date < this.first){ //ako je prije pocetka rezervacije
            this.dateNow = new Date(this.date); //pocinje danas, a zavrsice se pocetkom te prve rezervacije
            this.dateEnd = new Date(this.first);
            this.dateEnd.setDate(this.dateEnd.getDate() - 1);
            this.freeDates.push(new Dates(this.dateNow, this.dateEnd));
          }
          else if(this.first <= this.date && this.date < this.second){ //ako je utoku neke rez pocinje kranjem nje i pocetkom sledece rezervacije
            this.dateNow = new Date(this.second);
            this.dateNow.setDate(this.dateNow.getDate() + 1);
            if((i + 1) < this.reservations.length){
              this.dateEnd = new Date(Date.parse(this.reservations[i+1].StartDate.toString()));
              this.dateEnd.setDate(this.dateEnd.getDate() - 1);
            }
            else{
              this.dateEnd = new Date(2050, 12, 31);
            }
            this.freeDates.push(new Dates(this.dateNow, this.dateEnd));
          }

          if(this.reservations.length == 1){
            this.dateNow = new Date(this.second);
            this.dateNow.setDate(this.dateNow.getDate() + 1);
            this.dateEnd = new Date(2050, 12, 31);
            this.freeDates.push(new Dates(this.dateNow, this.dateEnd));

          }

        }
        else{
          this.dateNow = new Date(this.second);
            this.dateNow.setDate(this.dateNow.getDate() + 1);
            if((i + 1) < this.reservations.length){
              this.dateEnd = new Date(Date.parse(this.reservations[i+1].StartDate.toString()));
              this.dateEnd.setDate(this.dateEnd.getDate() - 1);
            }
            else{
              this.dateEnd = new Date(2050, 12, 31);
            }
            this.freeDates.push(new Dates(this.dateNow, this.dateEnd));
        }

      }
    }
  }

  Reservate( reservation: Reservation){
    reservation.VehicleId = this.id;
    this.serverService.postReservation(reservation)
    .subscribe(
      data => {
        this.show = false;
        this.dateNow = new Date(Date.parse(reservation.StartDate.toString()));
        this.dateEnd = new Date(Date.parse(reservation.EndDate.toString()));

      },
      err => {
        console.log(err);
      }
    )
  }

  placeMarker($event){
    console.log($event.coords.lat);
    console.log($event.coords.lng);
  }

  onStartMarkerClick(branch: any){
    this.selectedStartBranch = branch.Id;
    this.startLatitude = branch.Latitude;
    this.startLongitude = branch.Longitude;
  }

  onEndMarkerClick(branch: any){
    this.selectedEndBranch = branch.Id;
    this.endLatitude = branch.Latitude;
    this.endLongitude = branch.Longitude;
  }

  changeSelectedData(newValue){
    this.selectedDate = newValue;
    this.dateNow = this.selectedDate.startDate;
    this.dateEnd = this.dateNow;
  }

}
