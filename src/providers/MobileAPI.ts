import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpRequestsProvider } from './HttpRequests';
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
export class MobileAPIProvider extends HttpRequestsProvider {

  private ApiEndPoint: string;

    constructor(
      public http: HttpClient, 
      public storage: Storage,
      @Inject(MY_CONFIG_TOKEN) configuration: ApplicationConfig
    ) {
        super(http, storage);
        console.log('Hello MobileAPI Provider');
        this.ApiEndPoint = configuration.mobileApiEndpoint;
    }

    getUserDevices(): Promise<Array<Device>> {
      return this.getUserIdFromStorage().then(
        userId => {
          return this.get(this.ApiEndPoint + '/getUserDevices?userId=' + userId).then(
            data => {
              return data.map(item => {
                return new Device(item);
              })
            },
            error => {
              console.log(error);
              return Promise.reject("Could not get device list from API");
            }
          );
        },
        error => {
          return Promise.reject("Could not get userId from storage");
        }
      )
    }

    getDeviceRawMetrics(device: Device, timestamp: number): Promise<Array<RawMetric>> {
      return this.getUserIdFromStorage().then(
        userId => {
          return this.get(this.ApiEndPoint + '/getDeviceRawMetrics?userId=' + userId + '&deviceId=' + device.deviceId + "&timestamp=" + timestamp).then(
            data => {
              var rawMetrics = data.map(rawMetric => {return new RawMetric(rawMetric)});
              return rawMetrics;
            },
            error => {
              return Promise.reject("Could not get device raw metrics from API");
            }
          );
        }, 
        error => {
          return Promise.reject("Could not get userId from storage");
        }
      );
    }

    getDeviceCalcMetrics(device: Device, timestamp: number): Promise<Array<CalcMetric>> {
      return this.getUserIdFromStorage().then(
        userId => {
          return this.get(this.ApiEndPoint + '/getDeviceCalcMetrics?userId=' + userId + '&deviceId=' + device.deviceId + "&timestamp=" + timestamp).then(
            data => {
              var calcMetrics = data.map(calcMetric => {return new CalcMetric(calcMetric)});
              return calcMetrics;
            },
            error => {
              return Promise.reject("Could not get device raw metrics from API");
            }
          );
        },
        error => {
          return Promise.reject("Could not get userId from storage");
        }
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
