import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AlertsProvider } from '../../providers/Alerts';
import { MobileAPIProvider } from '../../providers/MobileAPI';
import { SendCommandToDevicePage } from '../sendCommandToDevice/sendCommandToDevice';

/*
  Generated class for the device page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-device',
    templateUrl: 'device.html'
})
export class DevicePage {
  metricType: string = "calcMetrics";
  loadingCalcMetrics: boolean;
  loadingRawMetrics: boolean;
  public device: any;

  constructor(
    public loadingCtrl: LoadingController,
    public nav: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alerts: AlertsProvider,
    public mobileApi: MobileAPIProvider
  ) {
    this.device = this.navParams.get('device');
    this.device.rawMetrics = [];
    this.device.calcMetrics = [];
  }

    ionViewDidLoad() {
      console.log('ionViewDidLoad devicePage');

      this.getRawMetrics();
      this.getCalcMetrics();
    }

    getRawMetrics(infiniteScroll?) {
      if (!infiniteScroll) this.loadingRawMetrics = true;
      var timestamp: number = Date.now();
      if (this.device.rawMetrics.length != 0)
        timestamp = this.device.rawMetrics[this.device.rawMetrics.length-1].date.getTime();
        
      this.mobileApi.getDeviceRawMetrics(this.device, timestamp).then(
        data => {
          if (infiniteScroll) infiniteScroll.complete();
          else this.loadingRawMetrics = false;
          this.device.rawMetrics = this.device.rawMetrics.concat(data);
          if (data.length == length && infiniteScroll) infiniteScroll.enable(false);
        },
        error => {
          if (infiniteScroll) infiniteScroll.complete();
          else this.loadingRawMetrics = false;
          console.error('Error getDeviceRawMetrics');
          console.dir(error);
          this.alerts.showErrorAlert(error, "getDeviceRawMetrics");
        }
      )
    }

    getCalcMetrics(infiniteScroll?) {
      if (!infiniteScroll) this.loadingCalcMetrics = true;
      var timestamp: number = Date.now();
      if (this.device.calcMetrics.length != 0)
        timestamp = this.device.calcMetrics[this.device.calcMetrics.length-1].dateTimeEnd.getTime();

      this.mobileApi.getDeviceCalcMetrics(this.device, timestamp).then(
        data => {
          if (infiniteScroll) infiniteScroll.complete();
          else this.loadingCalcMetrics = false;
          this.device.calcMetrics = this.device.calcMetrics.concat(data);
          if (data.length == length && infiniteScroll) infiniteScroll.enable(false);
        },
        error => {
          if (infiniteScroll) infiniteScroll.complete();
          else this.loadingCalcMetrics = false;
          console.error('Error getDeviceCalcMetrics');
          console.dir(error);
          this.alerts.showErrorAlert(error, "getDeviceCalcMetrics");
        }
      )
    }

    openSendCommandToDevicePage() {
      this.nav.push(SendCommandToDevicePage, { device: this.device });
    }

}
