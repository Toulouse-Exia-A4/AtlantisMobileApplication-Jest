import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApplicationConfig, MY_CONFIG, MY_CONFIG_TOKEN } from './app.config';

import { DevicePage } from '../pages/device/device';
import { DevicesListPage } from '../pages/devicesList/devicesList';
import { LoginPage } from '../pages/login/login';
import { SendCommandToDevicePage } from '../pages/sendCommandToDevice/sendCommandToDevice';
import { StartPage } from '../pages/start/start';

import { AlertsProvider } from '../providers/Alerts';
import { HttpRequestsProvider } from '../providers/HttpRequests';
import { EliotAPIProvider } from '../providers/EliotAPI';
import { MobileAPIProvider } from '../providers/MobileAPI';

@NgModule({
  declarations: [
    MyApp,
    DevicePage,
    DevicesListPage,
    LoginPage,
    SendCommandToDevicePage,
    StartPage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DevicePage,
    DevicesListPage,
    LoginPage,
    SendCommandToDevicePage,
    StartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlertsProvider,
    HttpRequestsProvider,
    EliotAPIProvider,
    MobileAPIProvider,
    {provide: MY_CONFIG_TOKEN, useValue: MY_CONFIG},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
