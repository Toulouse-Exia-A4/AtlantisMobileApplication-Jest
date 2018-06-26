import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpRequestsProvider } from './HttpRequests';
import * as JWT from 'jwt-decode';

/*
  Generated class for the EliotAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EliotAPIProvider extends HttpRequestsProvider {

    constructor(public http: HttpClient, public storage: Storage) {
        super(http, storage);
        console.log('Hello EliotAPI Provider');
    }

    authenticateMock(loginEntry): Promise<string> {
      return Promise.resolve("a3116453-afd4-4dd5-bfc7-983d048ad098");
    }

    authorize(window): Promise<any> {
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

    getToken(authorizationCode): Promise<string> {
      const requestTokenBody = new HttpParams()
          .set('client_id', "9999d816-d539-463a-afbd-7fc663de1c8a")
          .set('grant_type', "authorization_code")
          .set('code', authorizationCode)
          .set('client_secret', "8Gw97T22oUOo27/{)757Cu>,");
      return this.post("https://partners-login.eliotbylegrand.com/token", requestTokenBody, true).then(
        data => {
          return data.id_token;
        },
        error => {
          Promise.reject('Could not get Token using Legrand\'s API');
        }
      )
    }

    getUserIdFromToken(token): string {
      var decodedToken = JWT(token);
      return decodedToken['sub'];
    }

}
