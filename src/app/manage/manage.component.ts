import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms'

import { Service } from '../models/service.model';
import { Vehicle } from '../models/vehicle.model';
import { Branch } from '../models/branch.model';
import { PriceItem } from '../models/priceItem.model';
import { PriceList } from '../models/priceList.model';
import { Router } from '@angular/router';

import OlMap from 'ol/map';
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';
import OlView from 'ol/view';
import OlProj from 'ol/proj';
import { MapInfo } from '../models/mapInfo.model';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  styles: ['agm-map {height: 220px; width: 320px;}'] 
})
export class ManageComponent implements OnInit {

  public services:Observable<any>;
  public vehicles : Observable<any>;
  public branches : Observable<any>;

  public showAddForm:Boolean;
  public showVehicles : Boolean;
  public showBranches : Boolean;
  public selectedFile :any;
  public serviceId : number;
  public vehicleId : number;
  public priceList : PriceList;

  pS : number;
  pB : number;
  pV : number;

  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit() {
    this.callGet();
    this.showAddForm = false;
    this.showVehicles = false;
    this.showBranches = false;
    this.serviceId = -1;
    this.vehicleId = -1;
    this.priceList = new PriceList(-1, new Date(2018,6,12,0,0,0,0), new Date(2018,6,16,0,0,0,0),2);

    this.pS = 1;
    this.pV = 1;
    this.pB = 1;
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

  showForm()
  {
    this.showAddForm = !this.showAddForm;
    this.showVehicles = false;
    this.showBranches = false;

  }

  callGetVehicles(serviceId){
    
    this.serviceId = serviceId;
    this.showAddForm = false;
    this.showVehicles = !this.showVehicles;
    this.showBranches = false;

      this.serverService.getServiceVehicles(serviceId)
      .subscribe(
        data => {
          this.vehicles = data;
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetBranches(serviceId){
    
    this.serviceId = serviceId;
    this.showAddForm = false;
    this.showVehicles = false;
    this.showBranches = !this.showBranches;

      this.serverService.getServiceBranches(serviceId)
      .subscribe(
        data => {
          this.branches = data;
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

  onChange(event,id) {
  
    var updateV = new Vehicle(-1,"model","manufacturer",2018,"foto","decrp",-1,-1,-1,true);
    var isChecked = event.currentTarget.checked;
    this.vehicleId = id;

    this.serverService.getVehicle(this.vehicleId)
    .subscribe(
      data => {
        updateV = data;
        updateV.Enable = isChecked;

        this.serverService.putVehicle(this.vehicleId,updateV)
        .subscribe(
          data =>{
           // alert("Izmjenjeno vozilo");
            this.serverService.getServiceVehicles(this.serviceId)
          .subscribe(
            data => {
              this.vehicles = data;
              this.router.navigate(['/manage']);
            },
            error => {
              console.log(error);
            }
          )
          },
          error =>{
            console.log(error);
          } 
          )
      },
      error => {
        console.log(error);
      }
    )
   }

  AddService(service : Service, form : NgForm)
  {    
    this.serverService.postService(service, this.selectedFile)
    .subscribe(
      data =>{
        this.priceList.ServiceId = data.Id;
        this.serverService.postPriceList(this.priceList)
        .subscribe(
          data =>{
            this.serverService.getAllServices()
            .subscribe(
            data => {
              this.services = data;
            },
            error => {
              console.log(error);
            }
          )
          },
          error => {
            console.log(error);
          }
        )  
      },
      error => {
        console.log(error);
      } 
    )
  
    form.reset();
  }

}
