import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router';
import { ServerService } from '../services/server.service';
import { Vehicle } from '../models/vehicle.model';
import { PriceItem } from '../models/priceItem.model';
import { Observable } from 'rxjs';
import { PriceList } from '../models/priceList.model';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  public serviceId : number;
  public selectedFile :any;
  public vehicleId : number;
  public priceList : PriceList;
  public vehicles : Observable<any>;
  public types : Observable<any>;
  public vehicle : Vehicle;
  validationMessage : string;

  constructor(private serverService: ServerService, private route : ActivatedRoute,private router: Router) {
    route.params.subscribe(params => {this.serviceId = params["id"]});
   }

  ngOnInit() {
    
    this.vehicleId = -1;
    this.priceList = new PriceList(-1, new Date(2018,6,12,0,0,0,0), new Date(2018,6,16,0,0,0,0),2);
    this.vehicle = new Vehicle(-1,"model","manufacturer",2018,"foto","decription",-1,-1,-1,false);

    this.serverService.getServiceTypes()
    .subscribe(
    data => {
      this.types = data;
    },
    error => {
      console.log(error);
    }
    )    
  }

  onFileChanged(event)
  {
    this.selectedFile = event.target.files[0];
  }

  AddVehicle(vehicle : Vehicle, form : NgForm)
  {
    this.vehicle = vehicle;
    this.vehicle.ServiceId = this.serviceId; 
    if(this.selectedFile == undefined){
      this.validationMessage = "An error ocurred! Please, check all fields!";
    }
    else{
      this.serverService.postVehicle(this.vehicle, this.selectedFile)
      .subscribe(
        data =>{
          form.reset();
          this.vehicleId = data.Id;
          this.serverService.getServicePriceList(this.serviceId)
          .subscribe(
            data => {
              this.priceList = data; //popunjeni i price itemi
              this.serverService.postPriceItem(new PriceItem(this.vehicle.Price,this.vehicleId,this.priceList.Id))
              .subscribe(
                data => {
                  this.serverService.getServiceVehicles(this.serviceId)
                  .subscribe(
                    data => {
                      this.vehicles = data;
                      this.router.navigate(['/manage']);
                    },
                  error =>{
                    console.log(error);
                  }
                 )
                },
                error =>{
                  console.log(error);
                }
              )   
          },
            error =>{
              console.log(error);
          }
          ) 
        },
        error =>{
          this.validationMessage = "An error ocurred! Please, check all fields!"
          console.log(error);
        }
      )
    } 
  }

}
