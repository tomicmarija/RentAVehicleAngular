import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateViaManageGuard implements CanActivate {

  constructor() {}

  canActivate() {
    return localStorage.role == 'Manager';
  }
}