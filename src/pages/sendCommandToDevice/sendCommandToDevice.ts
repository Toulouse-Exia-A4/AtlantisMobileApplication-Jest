import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AlertsProvider } from '../../providers/Alerts';
import { MobileAPIProvider } from '../../providers/MobileAPI';

/*
  Generated class for the sendCommandToDevice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-sendCommandToDevice',
    templateUrl: 'sendCommandToDevice.html'
})
export class SendCommandToDevicePage {
  private device: any;
  public command: String;

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
        console.log('ionViewDidLoad sendCommandToDevicePage');
    }

    sendCommandToDevice() {
      let loader = this.loadingCtrl.create({
        content: "Sending command to device"
      });
      //Show the loading indicator
      loader.present();

      this.mobileApi.sendCommandToDevice(this.device, this.command).then(
        data => {
          loader.dismiss();
          this.alerts.showSuccessAlert(data.message, "sendCommandToDevice");
        },
        error => {
          loader.dismiss();
          console.error('Error sendCommandToDevice');
          console.dir(error);
          this.alerts.showErrorAlert(error, "sendCommandToDevice");
        }
      )
    }

}
