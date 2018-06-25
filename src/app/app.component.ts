import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StartPage } from '../pages/start/start';
import { LoginPage } from '../pages/login/login';
import { DevicesListPage } from '../pages/devicesList/devicesList';

import { HttpRequestsProvider } from '../providers/HttpRequests';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = StartPage;

  pages: Array<{title: string, component: any}>;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private menu: MenuController,
    private httpRequestsProvider: HttpRequestsProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.pages = [
        { title: 'Devices List', component: DevicesListPage }
      ];

      this.onInit();
    });

    platform.resume.subscribe(e => {
      this.onInit();
    })
  }

  onInit() {
    this.httpRequestsProvider.checkUserLoggedIn().then((result) => {
      console.log("userLoggedIn: " + result);
      this.rootPage = result ? DevicesListPage : LoginPage;
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.httpRequestsProvider.clearStorage();
    this.menu.close();
    this.nav.setRoot(LoginPage);
  }
}
