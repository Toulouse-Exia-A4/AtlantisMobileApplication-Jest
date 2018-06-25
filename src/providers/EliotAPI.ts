import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpRequestsProvider } from './HttpRequests';

/*
  Generated class for the EliotAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EliotAPIProvider extends HttpRequestsProvider {

    constructor(public http: HttpClient, public storage: Storage, public loadingCtrl: LoadingController) {
        super(http, storage, loadingCtrl);
        console.log('Hello EliotAPI Provider');
    }

    authenticate(loginEntry): Promise<string> {
      return this.post('http://legrand/login/oauth2', loginEntry).then(
        data => {
          return data.token;
        },
        error => {
          //return Promise.reject("Error while while trying to authenticate with Legrand Oauth2 API");
          return "azerty";
        }
      );
    }
}
