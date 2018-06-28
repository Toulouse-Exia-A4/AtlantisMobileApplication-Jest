import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AlertsProvider } from '../../providers/Alerts';
import { MobileAPIProvider } from '../../providers/MobileAPI';
import { DevicePage } from '../device/device';

/*
  Generated class for the devicesList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-devicesList',
    templateUrl: 'devicesList.html'
})
export class DevicesListPage {
  public devices: Array<any>;

  constructor(public loadingCtrl: LoadingController,
    public nav: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alerts: AlertsProvider,
    public mobileApi: MobileAPIProvider
  ) {
  }

    ionViewDidLoad() {
      console.log('ionViewDidLoad devicesListPage');

      let loader = this.loadingCtrl.create({
        content: "Loading Devices List"
      });
      //Show the loading indicator
      loader.present();

      this.mobileApi.getUserDevices().then(
        data => {
          loader.dismiss();
          this.devices = data;
        },
        error => {
          loader.dismiss();
          console.error('Error getDevices');
          console.dir(error);
          this.alerts.showErrorAlert(error, "getDevices");
        }
      )
    }

    goToDevice(device) {
      this.nav.push(DevicePage, { device: device });
    }

}
