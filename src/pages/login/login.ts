import { Component } from '@angular/core';
import { AlertsProvider } from '../../providers/Alerts';
import { LoadingController, NavController, Platform, NavParams, MenuController } from 'ionic-angular';
import { DevicesListPage } from '../devicesList/devicesList';
import { HttpRequestsProvider } from '../../providers/HttpRequests';
import { EliotAPIProvider } from '../../providers/EliotAPI';

/*
  Generated class for the login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var window: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginEntry = {};

  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerts: AlertsProvider,
    public eliotAPIProvider: EliotAPIProvider,
    private menu: MenuController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad loginPage');
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  loginForm() {
    let loader = this.loadingCtrl.create({
      content: "Connection"
    });
    //Show the loading indicator
    loader.present();

    this.eliotAPIProvider.authenticateMock(this.loginEntry).then(
      data => {
        this.eliotAPIProvider.saveUserId(data)
          .then((result) => {
            loader.dismiss();
            this.navCtrl.setRoot(DevicesListPage, { justLoggedIn: true });
          })
          .catch((err) => {
            loader.dismiss();
            console.log('Error Log in' + err);
            this.alerts.showErrorAlert(err, "Log In");
          });
      },
      error => {
        loader.dismiss();
        console.error('Error Log in');
        console.dir(error);
        this.alerts.showErrorAlert(error, "Log In");
      }
    );
  }

  login() {
    this.platform.ready().then(() => {
      this.eliotAPIProvider.authorize(window).then(success => {
        let loader = this.loadingCtrl.create({
          content: "Connection"
        });
        //Show the loading indicator
        loader.present();

        this.eliotAPIProvider.getToken(success.code).then(
          token => {
            this.eliotAPIProvider.saveUserId(this.eliotAPIProvider.getUserIdFromToken(token))
              .then((result) => {
                loader.dismiss();
                this.navCtrl.setRoot(DevicesListPage, { justLoggedIn: true });
              })
              .catch((err) => {
                loader.dismiss();
                console.error('Error Log in' + err);
                this.alerts.showErrorAlert(err, "Log In");
              });
            },
            error => {
              loader.dismiss();
              console.error('Error Log in' + error);
              this.alerts.showErrorAlert(error, "Log In");
            }
        )
      }, (error) => {
          alert(error);
      });
    });
  }

}
