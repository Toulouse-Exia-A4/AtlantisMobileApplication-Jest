import { NgModule, ErrorHandler, InjectionToken, Inject, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';

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

const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
const defaultTimeout = 35000;

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeout = Number(req.headers.get('timeout')) || this.defaultTimeout;
    return next.handle(req).timeout(timeout);
  }
}

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
    {provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true},
    {provide: DEFAULT_TIMEOUT, useValue: defaultTimeout},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
