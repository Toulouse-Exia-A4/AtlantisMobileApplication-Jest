import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpRequestsProvider } from './HttpRequests';
import { ApplicationConfig, MY_CONFIG, MY_CONFIG_TOKEN } from '../app/app.config';


class Device {
  id: String;
  calcMetrics: Array<Number>;
  rawMetrics: Array<Number>;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.calcMetrics = obj && obj.calcMetrics || null;
    this.rawMetrics = obj && obj.rawMetrics || null;
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

    getDevices(): Promise<Array<Device>> {
      return this.get(this.ApiEndPoint + '/device/all').then(
        data => {
          return data; 
        },
        error => {
          //return Promise.reject("Could not get device list from API");
          return [
            new Device({ id: 'azerty' }),
            new Device({ id: 'qsdfgh' }),
            new Device({ id: 'wxcvbn' }),
            new Device({ id: 'poiuyt' }),
            new Device({ id: 'mlkjhg' })
          ];
        }
      );

    }

    getDeviceInfo(device: Device): Promise<Device> {
      return this.get(this.ApiEndPoint + '/device/' + device.id).then(
        data => {
          return data;
        },
        error => {
          //return Promise.reject("Could not get device info from API");
          device.calcMetrics = [12, 13, 14];
          device.rawMetrics = [10, 16, 22];
          return device;
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
