import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms'
import { Grading } from '../models/grading.model';
import { forEach } from '@angular/router/src/utils/collection';
import {Service} from '../models/service.model';
import { ReservationComponent } from '../reservation/reservation.component';
import {Router} from '@angular/router';
import { PaginationModel } from '../models/pagination.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ ServerService]
})
export class HomeComponent implements OnInit {

  public services:Observable<any>;
  public vehicles: Array<any>;
  public foundVehicles : Array<any>;
  public gradings: Observable<any>;
  public priceItems : Array<any>;
  public priceList: any;
  public showVehicles:Boolean;
  public showPriceList:Boolean;
  public showGradings:Boolean;
  public showSearch : Boolean;
  public selectedService:number;
  public grades:number[];
  public grade: number;
  public searchFilter : string;
  public srcBy : string;
  validationMessage: string;

  p : number;
  pV : number;
  pP : number;
  pG : number;


  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit() {
    this.callGet();

    this.showVehicles = false;
    this.showPriceList = false;
    this.showGradings = false;
    this.showSearch = false;
    this.selectedService = -1;
    this.grades = [1, 2, 3, 4, 5];
    this.grade = 1;
    this.searchFilter = "Type";
    this.srcBy = "";

    this.p = 1;
    this.pV = 1;
    this.pP = 1;
    this.pG = 1;

  }

  callGet(){
    this.serverService.getAllServices()
    .subscribe(
      data => {
        
        this.services = data;
       
      },
      error => {
        console.log(error);
      }
    )
  }

  callGetVehicles(serviceId){
    if(this.selectedService == serviceId){
      this.showVehicles = false;
      this.selectedService = -1;
    }
    else{
      this.selectedService = serviceId;
      this.serverService.getServiceVehicles(serviceId)
      .subscribe(
        data => {
          this.vehicles = data;
          this.foundVehicles = this.vehicles;
        },
        error => {
          console.log(error);
        }
      )

      this.selectedService = serviceId;
      this.showVehicles = !this.showVehicles;

      if(this.showPriceList){
        this.showPriceList = false;
      }
      if(this.showGradings){
        this.showGradings = false;
      }
    }
  }

  callGetPriceList(serviceId){
    if(this.selectedService == serviceId){
      this.showPriceList = false;
    
      this.selectedService = -1;
    }
    else{

      this.serverService.getServicePriceList(serviceId)
      .subscribe(
        data => {
          this.priceList = data;
        },
        error => {
          console.log(error);
        }
      )

      this.selectedService = serviceId;
      this.showPriceList = !this.showPriceList;

      if(this.showVehicles){
        this.showVehicles = false;
      }
      if(this.showGradings){
        this.showGradings = false;
      }
    }
  }

  callGetGradings(serviceId){
    if(this.selectedService == serviceId){
      this.showGradings = false;
      this.selectedService = -1;
    }
    else{

      this.serverService.getServiceGradings(serviceId)
      .subscribe(
        data => {
          this.gradings = data;
        },
        error => {
          console.log(error);
        }
      )

      this.selectedService = serviceId;
      this.showGradings = !this.showGradings;

      if(this.showVehicles){
        this.showVehicles = false;
      }
      if(this.showPriceList){
        this.showPriceList = false;
      }
    }
  }

  addGrading(grading:Grading, form: NgForm){
    grading.ServiceId = this.selectedService;
    this.serverService.postGrading(grading)
    .subscribe(
      data =>{
        this.serverService.getServiceGradings(this.selectedService)
        .subscribe(
        data => {
          this.gradings = data;
        },
        error => {
          console.log(error);
        }
      )
      },
      error => {
        console.log(error);
        if(error.error.Message.includes("Authorization")){
          this.validationMessage = "You need to be loged in to add comments!";
        }
        else{
          this.validationMessage = error.error.Message;
        }
      }
      
    )
    this.grade = 1;
    form.reset();
  }

  CheckForReservation(vehicleId, serviceId) {
    this.serverService.getUserDetails()
    .subscribe(
      data => {
        if(data.DocumentPhoto == null || data.Approved == false){
          this.router.navigate(['/account']);
        }
        else{
          this.router.navigate(['/reservation', vehicleId, serviceId]);       
          console.log(data.UserName);
        }
        
      },
      err => {
        this.router.navigate(['/login'])
        console.log(err);
      }
    )
  }


  Filter()
  {
    this.showSearch = !this.showSearch;
  }

  Search()
  {
    this.foundVehicles = new Array<any>();

    this.serverService.getServiceVehicles(this.selectedService) 
    .subscribe(
      data => {
        this.vehicles = data;
        if(this.searchFilter == "Type"){
          this.vehicles.forEach((item,index) => {
            if(item.Type.Name.includes(this.srcBy)){
              this.foundVehicles.push(item);
            }   
          });

        }else if(this.searchFilter == "Attributes"){
          this.foundVehicles = new Array<any>();
          this.vehicles.forEach((item,index) => {
            if(item.Model.includes(this.srcBy) || item.Manufacturer.includes(this.srcBy)){
              this.foundVehicles.push(item);
            }
          });

        }else if(this.searchFilter == "Price")
        {
          this.foundVehicles = new Array<any>();
          this.serverService.getPriceItems()
          .subscribe(
          data => {
            this.priceItems = data;
          
            
          for(var veh of this.vehicles){
            for(var pi of this.priceItems){
                if(veh.Id == pi.VehicleId){
                  let price = pi.Price.toString();
                  if(price == this.srcBy){
                    this.foundVehicles.push(veh);

                  }
                }
            }
         }
        },
        error => {
          console.log(error);
        }
      )
        }
        
        if(this.srcBy == "")
        {
          this.foundVehicles = this.vehicles;
        }
       
      },
      error => {
        console.log(error);
      }
    )
  }

}
