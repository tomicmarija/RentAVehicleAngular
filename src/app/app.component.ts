import { Component, ViewChild, OnInit } from '@angular/core';
import { ServerService } from "../app/services/server.service"
import { User } from './models/user.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  constructor(private serverService: ServerService, private router: Router){

  }

  isLogedIn(){
    if(localStorage.jwt){
      return true;
    }
    else{
      return false;
    }
  }

  ngOnInit(){
    
  }

  callLogout(){
    this.serverService.logOut()
    .subscribe(
      data => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      err => {
        console.log();
      }
    )
  }
  
}




