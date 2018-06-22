import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AppUser } from '../models/appUser.model';
import { ServerService } from '../services/server.service';
import { LoginUser } from '../models/loginUser.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ ServerService]
})
export class LoginComponent implements OnInit {
  public show : Boolean;
  validationMessage: string = "";
  errors: any[] = [];
  today: Date;
  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit() {
    this.show = true;
    this.today = new Date();
  }

  ChangeShow(){
    this.show = !this.show;
  }

  Login(loginUser : LoginUser, form: NgForm){
      this.serverService.getTheToken(loginUser)
      .subscribe(
        res => {
          let jwt = res.access_token;
  
          let jwtData = jwt.split('.')[1]
          let decodedJwtJsonData = window.atob(jwtData)
          let decodedJwtData = JSON.parse(decodedJwtJsonData)
          
          let role = decodedJwtData.role
          console.log(role);
  
  
          localStorage.setItem('jwt',jwt)
          localStorage.setItem('role',role)
          
          this.router.navigate(['/home']);
        },
        err => {
          this.validationMessage = err.error.error_description;
          console.log(err);
        }
      )
      
      
  }

  Registrate(appUser: AppUser, form: NgForm ){
    this.errors = [];
    this.serverService.registerAppUser(appUser)
    .subscribe(
      data => { 
        this.serverService.getTheToken(new LoginUser(appUser.UserName, appUser.Password))
        .subscribe(
          res => {
            let jwt = res.access_token;
    
            let jwtData = jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            let decodedJwtData = JSON.parse(decodedJwtJsonData)
            
            let role = decodedJwtData.role
            console.log(role);
    
    
            localStorage.setItem('jwt',jwt)
            localStorage.setItem('role',role)
            
            this.router.navigate(['/home']);
          },
          err => {
            this.validationMessage = err.error.error_description;
            console.log(err);
          }
        )
      },
      error => {
        console.log(error);
        for (var key in error.error.ModelState) {
          for (var i = 0; i < error.error.ModelState[key].length; i++) {
              this.errors.push(error.error.ModelState[key][i]);
          }
        }
      }
    )
  }

}
