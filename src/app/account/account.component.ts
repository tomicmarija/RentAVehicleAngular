import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms'
import { User } from '../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User = new User();
  selectedFile: any;
  note: string;
  validationMessage: string;

  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() : any {
    this.serverService.getUserDetails()
    .subscribe(
      data => {
        this.user = data;
        if(this.user.DocumentPhoto == null){
          this.note = ", You need to complement your account with document photo, first!";
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  onFileChange(event){
    this.selectedFile = event.target.files[0];
  }

  UpdateUser(_user: User, form: NgForm){
    _user.Id = this.user.Id;
    if(this.selectedFile == undefined){
      _user.DocumentPhoto = this.user.DocumentPhoto;
    }
    this.serverService.putAppUser(_user, this.selectedFile)
    .subscribe(
      data => {
        this.user = data;
        if(this.user.DocumentPhoto == null){
          this.note = ", You need to complement your account with document photo, first!";
        }
        else if(this.user.Approved == false){
          this.note = ", your account is not approved yet. Please wait until administrator approve it!";
        }
        else{
          this.router.navigate(['/home']);
        }
      },
      err => {
        this.validationMessage = "An error ocurred! Please, check all fields!";
        console.log(err);
      }
    );
  }
}
