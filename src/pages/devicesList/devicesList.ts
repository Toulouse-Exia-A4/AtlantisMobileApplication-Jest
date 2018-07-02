import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
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

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public nav: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alerts: AlertsProvider,
    public mobileApi: MobileAPIProvider
  ) {
  }

    ionViewDidLoad() {
      console.log('ionViewDidLoad devicesListPage');

      this.getUser().then(
        data => {
          this.getDeviceList();
        }, 
        error => {
          if (error.status)
            this.createUser();
          else
            this.alerts.showErrorAlert(error, "getUser");
        })
    }

    getUser(): Promise<any> {
      const loader = this.loadingCtrl.create({content: "loading ..."});
      loader.present();

      return this.mobileApi.getUser().then(
        data => {
          loader.dismiss();
          return Promise.resolve();
        },
        error => {
          loader.dismiss();
          return Promise.reject(error);
        }
      )
    }

    createUser() {
      let createUserAlert = this.alertCtrl.create({
        title: "User creation",
        inputs: [
          {name: 'firstname', placeholder: 'First Name'},
          {name: 'lastname', placeholder: 'Last Name'}
        ],
        buttons: [
          {
            text: 'Create',
            handler: data => {
              const loader = this.loadingCtrl.create({content: "Creating user ..."});
              loader.present();
              this.mobileApi.createUser(data.firstname, data.lastname).then(
                data => {
                  loader.dismiss();
                  this.getDeviceList();
                },
                error => { 
                  loader.dismiss();
                  this.alerts.showErrorAlert(error, "createUser");
                }
              )
            }
          }
        ],
        enableBackdropDismiss: false
      });

      createUserAlert.present();
    }

    getDeviceList() {
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
