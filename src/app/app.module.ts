import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import {NgxPaginationModule} from 'ngx-pagination';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/interceptors';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NgSrcModule } from 'ng-src';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AccountComponent } from './account/account.component';

import {CanActivateViaManageGuard} from './guard/manage.guard';
import {CanActivateViaUserGuard} from './guard/user.guard';
import {CanActivateViaAdminGuard} from './guard/admin.guard';
import { AdministrateComponent } from './administrate/administrate.component';


const Routes = [
  {
    path: "",
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path:"manage",
    component: ManageComponent,
    canActivate: [CanActivateViaManageGuard]
  },
  {
    path: "addVehicle/:id",
    component: AddVehicleComponent
  },
  {
    path: "addBranch/:id",
    component : AddBranchComponent
  },
  {
    path: 'reservation/:id/:serviceId',
    component: ReservationComponent
  },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [CanActivateViaUserGuard]
  },
  {
    path : "administrate",
    component: AdministrateComponent,
    canActivate: [CanActivateViaAdminGuard]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    ManageComponent,
    AddVehicleComponent,
    AddBranchComponent,
    ReservationComponent,
    AccountComponent,
    AdministrateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(Routes),
    HttpClientModule,
    NgSrcModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'})
  ],
  providers: [
    CanActivateViaManageGuard,
    CanActivateViaUserGuard,
    CanActivateViaAdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA 
  ]
})

export class AppModule { }
