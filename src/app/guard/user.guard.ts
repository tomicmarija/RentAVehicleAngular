import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateViaUserGuard implements CanActivate {

  constructor() {}

  canActivate() {
    return (localStorage.role == 'Admin' || localStorage.role == 'Manager' || localStorage.role =='AppUser');
  }
}