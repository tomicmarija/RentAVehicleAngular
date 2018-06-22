import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router';
import { ServerService } from '../services/server.service';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';


@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit {
  public serviceId : number;
  public selectedFile :any;
  public branches : Observable<any>;
  validationMessage : string;

  constructor(private serverService: ServerService, private route : ActivatedRoute,private router: Router) {
    route.params.subscribe(params => {this.serviceId = params["id"]});
   }

  ngOnInit() {
 
  }

  onFileChanged(event)
  {
    this.selectedFile = event.target.files[0];
  }

  AddBranch(branch : Branch, form : NgForm)
  {
    branch.ServiceId = this.serviceId;
        this.serverService.postBranch(branch, this.selectedFile)
        .subscribe(
          data =>{
            form.reset();
            this.serverService.getServiceBranches(this.serviceId)
            .subscribe(
              data => {
                this.branches = data;
                this.router.navigate(['/manage']);
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
