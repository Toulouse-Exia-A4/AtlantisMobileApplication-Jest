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
  }

    ionViewDidLoad() {
      console.log('ionViewDidLoad devicePage');

      let loader = this.loadingCtrl.create({
        content: "Loading Devices List"
      });
      //Show the loading indicator
      loader.present();

      this.mobileApi.getDeviceInfo(this.device).then(
        data => {
          loader.dismiss();
          this.device = data;
        },
        error => {
          loader.dismiss();
          console.error('Error getDeviceInfo');
          console.dir(error);
          this.alerts.showErrorAlert(error, "getDeviceInfo");
        }
      )
    }

    openSendCommandToDevicePage() {
      this.nav.push(SendCommandToDevicePage, { device: this.device });
    }

}
