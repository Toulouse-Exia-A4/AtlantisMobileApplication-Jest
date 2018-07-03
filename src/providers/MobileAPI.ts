import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { EliotAPIProvider } from './EliotAPI';
import { ApplicationConfig, MY_CONFIG, MY_CONFIG_TOKEN } from '../app/app.config';

class User {
  userId:     string;
  firstname:  string;
  lastname:   string;
  devices: Array<Device>;

  constructor(obj?: any) {
    this.userId     = obj && obj.userId     || null;
    this.firstname  = obj && obj.firstname  || null;
    this.lastname   = obj && obj.lastname   || null;
    this.devices    = obj && obj.devices.map(device => {return new Device(device);}) || [];
  }
}

class Device {
  deviceId:     String;
  name:         string;
  type:         string;
  unit:         string;
  calcMetrics:  Array<Number>;
  rawMetrics:   Array<Number>;

  constructor(obj?: any) {
    this.deviceId     = obj && obj.deviceId     || null;
    this.name         = obj && obj.name         || null;
    this.type         = obj && obj.type         || null;
    this.unit         = obj && obj.unit         || null;
    this.calcMetrics  = [];
    this.rawMetrics   = [];
  }
}

class RawMetric {
  deviceId:   string;
  date:       Date;
  value:      string;

  constructor(obj?: any) {
    this.deviceId   = obj && obj.deviceId                     || null;
    this.date       = obj && obj.date && new Date(obj.date)   || null;
    this.value      = obj && obj.value                        || null;
  }
}

class CalcMetric {
  id: string;
  deviceId: string;
  dateTimeStart: Date;
  dateTimeEnd: Date;
  value: number;
  dataType: string;

  constructor(obj?: any) {
    this.id             = obj && obj.id                                             ||null;
    this.deviceId       = obj && obj.deviceId                                       || null;
    this.dateTimeStart  = obj && obj.dateTimeStart && new Date(obj.dateTimeStart)   || null;
    this.dateTimeEnd    = obj && obj.dateTimeEnd && new Date(obj.dateTimeEnd)       || null;
    this.value          = obj && obj.value                                          || null;
    this.dataType       = obj && obj.dataType                                       || null;
  }
}

/*
  Generated class for the MobileAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MobileAPIProvider extends EliotAPIProvider {

  private ApiEndPoint: string;

    constructor(
      public http: HttpClient, 
      public storage: Storage,
      @Inject(MY_CONFIG_TOKEN) configuration: ApplicationConfig
    ) {
        super(http, storage, configuration);
        console.log('Hello MobileAPI Provider');
        this.ApiEndPoint = configuration.mobileApiEndpoint;
    }

    getUser(): Promise<User> {
      return this.requestMobileAPI(this.ApiEndPoint + "/getUser", "Could not get user from MobileAPI").then(
        data => {
          return new User(data);
        },
        error => {
          return Promise.reject(error); 
        }
      )
    }

    createUser(firstname: string, lastname: string): Promise<User> {
      var body = {
        firstname: firstname,
        lastname: lastname
      };
      return this.requestMobileAPI(this.ApiEndPoint + "/createUser", "Could not create user using MobileAPI", body, true).then(
        data => {
          return new User(data);
        },
        error => { return Promise.reject(error); }
      )
    }

    getDeviceRawMetrics(device: Device, timestamp: number): Promise<Array<RawMetric>> {
      var body = {
        deviceId: device.deviceId,
        timestamp: timestamp
      };
      return this.requestMobileAPI(this.ApiEndPoint + '/getDeviceRawMetrics', "Could not get user raw metrics from MobileAPI", body).then(
        data => {
          var rawMetrics = data.map(rawMetric => {return new RawMetric(rawMetric)});
          return rawMetrics;
        },
        error => {
          return Promise.reject(error);
        }
      )
    }

    getDeviceCalcMetrics(device: Device, timestamp: number): Promise<Array<CalcMetric>> {
      var body = {
        deviceId: device.deviceId,
        timestamp: timestamp
      };
      return this.requestMobileAPI(this.ApiEndPoint + '/getDeviceCalcMetrics', "Could not get user calc metrics from MobileAPI", body).then(
        data => {
          var calcMetrics = data.map(calcMetric => {return new CalcMetric(calcMetric)});
          return calcMetrics;
        },
        error => {
          return Promise.reject(error);
        }
      )
    }

    sendCommandToDevice(device: Device, command: any): Promise<any> {
      var body =  {
        deviceId: device.deviceId,
        command: command
      };
      return this.requestMobileAPI(this.ApiEndPoint + '/sendMessageToDevice',"Could not send command to device using MobileAPI", body, true).then(
        data => {
          return data;
        },
        error => {
          return Promise.reject(error);
        }
      )
    }

    private requestMobileAPI(url: string, errorMessage: string, body?: object, post: boolean = false): Promise<any> {
      return this.getTokenFromStorage().then(
        token => {
          if (!body) body = {};
          body["token"] = token;
          if (post)
            return this.post(url, body).then(
              data => { return data; },
              (error: HttpErrorResponse) => {
                return this.requestMobileAPIErrorHandler(error, url, errorMessage, body, post);
              }
            );
          else
            return this.get(url + this.BuildURLParametersString(body)).then(
              data => { return data },
              (error: HttpErrorResponse) => { 
                return this.requestMobileAPIErrorHandler(error, url, errorMessage, body, post);
              }
            );
        },
        error => { return Promise.reject("Could not get token from storage"); }
      ); 
    }

    private requestMobileAPIErrorHandler(error: HttpErrorResponse, url: string, errorMessage: string, body?: object, post: boolean = false): Promise<any> {
      if (error.status == 401) {
        return this.refreshToken().then(
          () => {
            return this.requestMobileAPI(url, errorMessage, body, post);
          },
          error => { return Promise.reject("session expired"); }
        )
      }
      else if (error.status == 404 && error.error == "User does not exist") {
        return Promise.reject(error);
      }
      return Promise.reject(errorMessage);
    }

}
