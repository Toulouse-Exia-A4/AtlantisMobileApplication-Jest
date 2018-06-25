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
    public httpRequestProvider: HttpRequestsProvider,
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

    this.eliotAPIProvider.authenticate(this.loginEntry).then(
      data => {
        this.httpRequestProvider.saveToken(data)
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
      this.legrandLogin().then(success => {
          alert(success.code);
      }, (error) => {
          alert(error);
      });
    });
  }

  legrandLogin(): Promise<any> {
    return new Promise(function(resolve, reject) {
      var browserRef = window.cordova.InAppBrowser.open("https://partners-login.eliotbylegrand.com/authorize?client_id=" + "9999d816-d539-463a-afbd-7fc663de1c8a" + "&redirect_uri=" + "https://login.microsoftonline.com/tfp/oauth2/nativeclient" + "&response_type=code", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
      browserRef.addEventListener("loadstart", (event) => {
          if ((event.url).indexOf("https://login.microsoftonline.com/tfp/oauth2/nativeclient") === 0) {
              browserRef.removeEventListener("exit", (event) => {});
              browserRef.close();
              var responseParameters = ((event.url).split("?")[1]).split("&");
              var parsedResponse = {};
              for (var i = 0; i < responseParameters.length; i++) {
                  parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
              }
              if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
                  resolve(parsedResponse);
              } else {
                  reject("Problem authenticating with Legrand");
              }
          }
      });
      // browserRef.addEventListener("exit", function(event) {
      //     reject("The Legrand sign in flow was canceled");
      // });
  });
  }

}
