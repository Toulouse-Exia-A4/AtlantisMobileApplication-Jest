import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, NavParams, MenuController } from 'ionic-angular';
import { DevicesListPage } from '../devicesList/devicesList';
import { AlertsProvider } from '../../providers/Alerts';
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
      tokens => {
        this.eliotAPIProvider.saveToken(tokens.token)
          .then((result) => {
            this.eliotAPIProvider.saveRefreshToken(tokens.refreshToken)
            .then(result2 => {
              loader.dismiss();
              this.navCtrl.setRoot(DevicesListPage, { justLoggedIn: true });
            }).catch(err => { this.loginErrorHandler(err, loader) })
          })
          .catch((err) => { this.loginErrorHandler(err, loader) });
        },
        error => { this.loginErrorHandler(error, loader) }
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

        this.eliotAPIProvider.getTokens(success.code).then(
          tokens => {
            this.eliotAPIProvider.saveToken(tokens.token)
              .then((result) => {
                this.eliotAPIProvider.saveRefreshToken(tokens.refreshToken)
                .then(result2 => {
                  loader.dismiss();
                  this.navCtrl.setRoot(DevicesListPage, { justLoggedIn: true });
                }).catch(err => { this.loginErrorHandler(err, loader) })
              })
              .catch((err) => { this.loginErrorHandler(err, loader) });
            },
            error => { this.loginErrorHandler(error, loader) }
        )
      }, (error) => {
          this.alerts.showErrorAlert(error, "login");
      });
    });
  }

  loginErrorHandler(err, loader) {
    loader.dismiss();
    console.error('Error Log in' + err);
    this.alerts.showErrorAlert(err, "Log In");
  }

}
