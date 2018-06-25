import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

import { HttpRequestsProvider } from '../providers/HttpRequests';

describe('MyApp', () => {

  let fixture: ComponentFixture<MyApp>;
  let instance: MyApp;

  const platformStub = {
    ready: (): Promise<string> => new Promise<string>((resolve, reject) => resolve('ready')),
    resume: {
      subscribe: (): void => undefined
    }
  };
  const statusBarStub = {
    styleDefault: (): void => undefined
  };
  const splashScreenStub = {
    hide: (): void => undefined
  };
  const menuControllerStub = {
    close: (): Promise<Boolean> => new Promise<Boolean>((resolve, reject) => resolve(true))
  };
  // const alertsProviderStub = {
  //   showErrorAlert: (): void => undefined,
  //   showSuccessAlert: (): void => undefined
  // };
  const httpRequestProviderStub = {
    // post: (): Promise<any> => undefined,
    // get: (): Promise<any> => undefined,
    checkUserLoggedIn: (): Promise<Boolean> => new Promise<Boolean>((resolve, reject) => resolve(true)),
    // saveToken: (): void => undefined,
    // getTokenFromStorage: (): Promise<any> => undefined,
    clearStorage: (): void => undefined
  };
  const eliotAPIProviderStub = {
    authenticate: (): Promise<string> => undefined
  };
  const mobileAPIProviderStub = {
    getDevices: (): Promise<Array<any>> => undefined,
    getDeviceInfo: (): Promise<any> => undefined,
    sendCommandToDevice: (): Promise<any> => undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        MyApp
      ],
      providers: [
        {provide: Platform, useValue: platformStub},
        {provide: StatusBar, useValue: statusBarStub},
        {provide: SplashScreen, useValue: splashScreenStub},
        {provide: MenuController, useValue: menuControllerStub},
        {provide: HttpRequestsProvider, useValue: httpRequestProviderStub},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    instance = fixture.debugElement.componentInstance;
  });

  it('should create the root page', () => {
    expect(instance).toBeTruthy();
  });

});
