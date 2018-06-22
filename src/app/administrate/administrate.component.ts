import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms'
import { Service } from '../models/service.model';

import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-administrate',
  templateUrl: './administrate.component.html',
  styleUrls: ['./administrate.component.css']
})
export class AdministrateComponent implements OnInit {

  pS : number;
  pU : number;
  pM : number;
  serviceId : number;
  userId : number;
  managerId : number;
  services : Observable<any>;
  users : Observable<any>;
  managers: Observable<any>;
  unapprovedUsers : any[] = [];
  unapprovedServices : any[] = [];

  showServices : Boolean;
  showAccounts : Boolean;
  showManagers : Boolean;


  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit() {
    this.pS = 1;
    this.pU = 1;
    this.pM = 1;
    this.serviceId = -1;
    this.userId = -1;
    this.managerId = -1;
    this.showAccounts = false;
    this.showServices = false;
    this.showManagers = false;
  }

  callGetServices()
  {
    this.showAccounts = false;
    this.showManagers = false;
    this.showServices = !this.showServices;

    this.serverService.getAllServices()
    .subscribe(
      data => {
        data.forEach(element => {
          if(!element.Approved){
            this.unapprovedServices.push(element);
          }
        });
      },
      error => {
        console.log(error);
      }
    )

  }

  callGetUsers(){
    this.showServices = false;
    this.showManagers = false;
    this.showAccounts = !this.showAccounts;

    
    this.serverService.getAllUsers()
    .subscribe(
      data => {
        data.forEach(element => {
          if(!element.Approved){
            this.unapprovedUsers.push(element);
          }
        });
      },
      error => {
        console.log(error);
      }
    )
  }

  callGetManagers(){
    this.showServices = false;
    this.showAccounts = false;
    this.showManagers = !this.showManagers;

    this.serverService.getAllManagers()
    .subscribe(
      data => {
        this.managers = data;
      },
      error => {
        console.log(error);
      }
    )

  }

  ApproveUser(userId){
    var updateA = new User();
    this.userId = userId;

    this.serverService.getUser(this.userId)
    .subscribe(
      data => {
        updateA = data;

        updateA.Approved = true;

        this.serverService.putAppUser(updateA,undefined)
        .subscribe(
          data =>{
            this.serverService.getAllUsers()
          .subscribe(
            data => {
              this.unapprovedUsers = [];
              data.forEach(element => {
                if(!element.Approved){
                  this.unapprovedUsers.push(element);
                }
              });
         
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


  onChange(event,id) {
  
    var updateS = new Service(-1,"name","logo","email","desc",true);
    var isChecked = event.currentTarget.checked;
    this.serviceId = id;

    this.serverService.getService(this.serviceId)
    .subscribe(
      data => {
        updateS = data;
        updateS.Approved = isChecked;

        this.serverService.putService(this.serviceId,updateS)
        .subscribe(
          data =>{
            this.serverService.getAllServices()
          .subscribe(
            data => {
              this.unapprovedServices = [];
              data.forEach(element => {
                if(!element.Approved){
                  this.unapprovedServices.push(element);
                }
              });
              
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

   onChangeAllow(event,id)
   {
    var updateM = new User();
    var isChecked = event.currentTarget.checked;
    this.managerId = id;

    this.serverService.getUser(this.managerId)
    .subscribe(
      data => {
        updateM = data;
        updateM.AllowCreating = isChecked;

        this.serverService.putAppUser(updateM,undefined)
        .subscribe(
          data =>{
            this.serverService.getAllManagers()
          .subscribe(
            data => {
              this.services = data;
              this.router.navigate(['/administrate']);
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

}
