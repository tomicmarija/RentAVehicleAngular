import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import { Grading } from '../models/grading.model';
import { AppUser } from '../models/appUser.model';
import { LoginUser } from '../models/loginUser.model';
import { Service } from '../models/service.model';
import { Vehicle } from '../models/vehicle.model';
import { Branch } from '../models/branch.model';
import { PriceItem } from '../models/priceItem.model';
import { PriceList } from '../models/priceList.model';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})

export class ServerService {

  constructor(private httpClient: HttpClient) { }

  private parseData(res: Response){
    return res.json() || [];
  }

  private handleError(error: Response | any){
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    return Observable.throw(errorMessage);
  }

  getAllServices() : Observable<any>{
    
    return this.httpClient.get('https://localhost:44375/api/Services');
  }

  getAllUsers() : Observable<any>{
    
    return this.httpClient.get('https://localhost:44375/api/AppUsers');
  }

  getAllManagers() : Observable<any>{
    
    return this.httpClient.get('https://localhost:44375/api/AppUsers/GetManagers');
  }

  getAllServices1(pageIndex, pageSize) : Observable<any>{
    let param = new HttpParams().set('pageIndex', pageIndex);
    param = param.set('pageSize',pageSize);
    return this.httpClient.get('https://localhost:44375/api/Services', {params: param});
  }

  getAllVehicles1(pageIndex, pageSize) : Observable<any>{
    let param = new HttpParams().set('pageIndex', pageIndex);
    param = param.set('pageSize',pageSize);
    return this.httpClient.get('https://localhost:44375/api/Vehicles', {params: param});
  }

  getServiceVehicles(serviceId) : Observable<any>{
    let param = new HttpParams().set('serviceId', serviceId);
    return this.httpClient.get('https://localhost:44375/api/Vehicles', {params: param});
  } 

  getServiceGradings(serviceId) : Observable<any>{
    let param = new HttpParams().set('serviceId', serviceId);
    return this.httpClient.get('https://localhost:44375/api/Gradings', {params: param});
  }

  getServiceBranches(serviceId) : Observable<any>{
    let param = new HttpParams().set('serviceId', serviceId);
    return this.httpClient.get('https://localhost:44375/api/Branches', {params: param});
  }

  getServicePriceList(serviceId) : any{
    let param = new HttpParams().set('serviceId', serviceId);
    return this.httpClient.get('https://localhost:44375/api/PriceLists', {params: param});
  }

  getServiceTypes() : Observable<any>{
    
    return this.httpClient.get('https://localhost:44375/api/Types');
  }

  getVehicle(id) : any{
    let param = new HttpParams().set('id', id);
    return this.httpClient.get('https://localhost:44375/api/Vehicles', {params: param});
  } 

  getService(id) : any{
    let param = new HttpParams().set('id', id);
    return this.httpClient.get('https://localhost:44375/api/Services', {params: param});
  } 

  getUser(id) : any{
    let param = new HttpParams().set('id', id);
    return this.httpClient.get('https://localhost:44375/api/AppUsers', {params: param});
  } 

  postGrading(grading: Grading): Observable<any>{
    return this.httpClient.post("https://localhost:44375/api/Gradings", grading, httpOptions);
  }

  postPriceItem(price: PriceItem): Observable<any>{
    return this.httpClient.post("https://localhost:44375/api/PriceItems", price);
  }

  postPriceList(priceList: PriceList): Observable<any>{
    return this.httpClient.post("https://localhost:44375/api/PriceLists", priceList);
  }

  putVehicle(vehicleId : number, vehicle: Vehicle): Observable<any>{
    return this.httpClient.put(`https://localhost:44375/api/Vehicles/${vehicleId}`, vehicle );
  }

  putService(serviceId : number, service: Service): Observable<any>{
    return this.httpClient.put(`https://localhost:44375/api/Services/${serviceId}`, service );
  }

  putUser(userId : number, user: AppUser): Observable<any>{
    return this.httpClient.put(`https://localhost:44375/api/AppUsers/${userId}`, user );
  }

  postService(service : Service, image: File) : any{
  
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data')
    let body = new FormData()
    body.append('service', JSON.stringify(service))
    body.append('image', image, image.name)

    return this.httpClient.post("https://localhost:44375/api/Services", body, {'headers': headers});
  }

  postVehicle(vehicle : Vehicle, image: File) : Observable<any>{
  
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data')
    let body = new FormData()
    body.append('vehicle', JSON.stringify(vehicle))
    body.append('image', image, image.name)

    return this.httpClient.post("https://localhost:44375/api/Vehicles", body, {'headers': headers});
  }

  postBranch(branch : Branch, image: File) : Observable<any>{
  
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data')
    let body = new FormData()
    body.append('branch', JSON.stringify(branch))
    body.append('image', image, image.name)

    return this.httpClient.post("https://localhost:44375/api/Branches", body, {'headers': headers});
  }

  registerAppUser(appUser: any) : any {
    return this.httpClient.post("https://localhost:44375/api/Account/Register", appUser);
  }
  getTheToken(loginUser : LoginUser) : Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-type','application/x-www-form-urlencoded');

    return this.httpClient.post('https://localhost:44375/oauth/token', 'username='+loginUser.UserName+'&password='+loginUser.Password+'&grant_type=password',{"headers": headers});

  }

  postReservation(reservation: Reservation) : Observable<any> {
    return this.httpClient.post('https://localhost:44375/api/Reservations', reservation, httpOptions);
  }

  getUserDetails() : any {
    return this.httpClient.get('https://localhost:44375/api/AppUsers/0', httpOptions)
  }

  putAppUser(user: User, image: File): any{
    let header = new HttpHeaders();
    header.append('enctype', 'multipart/form-data');
    let body = new FormData();
    body.append('user', JSON.stringify(user));
    if(image != undefined){
      body.append('image', image, image.name);
    }

    return this.httpClient.put(`https://localhost:44375/api/AppUsers/${user.Id}`, body, {'headers': header});
  }

  getPriceItem(id) : any {
    //let param = new HttpParams().set('id', id);
    return this.httpClient.get(`https://localhost:44375/api/PriceItems/${id}`, httpOptions);
  }

  getPriceItems() : Observable<any>{
    return this.httpClient.get('https://localhost:44375/api/PriceItems');
  }

  getReservations(id) : Observable<any> {
    let param = new HttpParams().set('vehicleId', id);
    return this.httpClient.get("https://localhost:44375/api/Reservations", {params : param});
  }

  logOut() : any{
    return this.httpClient.post("https://localhost:44375/api/Account/Logout", httpOptions);
  }
}





