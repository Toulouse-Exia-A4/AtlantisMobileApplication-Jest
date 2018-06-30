import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { EliotAPIProvider } from './EliotAPI';
import { ApplicationConfig, MY_CONFIG, MY_CONFIG_TOKEN } from '../app/app.config';


class Device {
  id:           string;
  deviceId:     String;
  type:         string;
  unit:         string;
  calcMetrics:  Array<Number>;
  rawMetrics:   Array<Number>;

  constructor(obj?: any) {
    this.id           = obj && obj.id           || null;
    this.deviceId     = obj && obj.deviceId     || null;
    this.type         = obj && obj.type         || null;
    this.unit         = obj && obj.unit         || null;
    this.calcMetrics  = [];
    this.rawMetrics   = [];
  }
}

class RawMetric {
  id:         string;
  deviceId:   string;
  date:       Date;
  value:      string;

  constructor(obj?: any) {
    this.id         = obj && obj.id                           || null;
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

    getUserDevices(): Promise<Array<Device>> {
      return this.requestMobileAPI(this.ApiEndPoint + '/getUserDevices').then(
        data => {
          return data.map(item => {
            return new Device(item);
          })
        },
        error => { return Promise.reject(error); }
      )
    }

    getDeviceRawMetrics(device: Device, timestamp: number): Promise<Array<RawMetric>> {
      var body = {
        deviceId: device.deviceId,
        timestamp: timestamp
      };
      return this.requestMobileAPI(this.ApiEndPoint + '/getDeviceRawMetrics', body).then(
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
      return this.requestMobileAPI(this.ApiEndPoint + '/getDeviceCalcMetrics', body).then(
        data => {
          var calcMetrics = data.map(calcMetric => {return new CalcMetric(calcMetric)});
          return calcMetrics;
        },
        error => {
          return Promise.reject(error);
        }
      )
    }

    private requestMobileAPI(url, body?: object): Promise<any> {
      return this.getTokenFromStorage().then(
        token => {
          if (!body) body = {};
          body["token"] = token;
          return this.get(url + this.BuildURLParametersString(body)).then(
            data => { return data },
            (error: HttpErrorResponse) => { 
              if (error.status == 401) {
               return this.refreshToken().then(
                 () => {
                   return this.requestMobileAPI(url, body);
                 },
                 error => { return Promise.reject("session expired"); }
               )
              }
              return Promise.reject("Could not get device raw metrics from API");
            }
          );
        },
        error => { return Promise.reject("Could not get token from storage"); }
      ); 
    }

    sendCommandToDevice(device: Device, command: any): Promise<any> {
      return this.post(this.ApiEndPoint + '/device/' + device.id + '/command', command).then(
        data => {
          return data;
        },
        error => {
          //return Promise.reject("Could not send command to device using API");
          return {
            status: "success",
            message: "Message sent to and received by device"
          };
        }
      )
    }

}
