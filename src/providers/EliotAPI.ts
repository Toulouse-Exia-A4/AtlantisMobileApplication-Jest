import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpRequestsProvider } from './HttpRequests';
import * as JWT from 'jwt-decode';
import { ApplicationConfig, MY_CONFIG, MY_CONFIG_TOKEN } from '../app/app.config';

/*
  Generated class for the EliotAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EliotAPIProvider extends HttpRequestsProvider {

    private client_id: string;
    private client_secret: string;
    private oauthBaseEndpoint: string;
    private oauthRedirectEndpoint: string;

    constructor(
        public http: HttpClient, 
        public storage: Storage,
        @Inject(MY_CONFIG_TOKEN) configuration: ApplicationConfig
    ) {
        super(http, storage);
        console.log('Hello EliotAPI Provider');
        this.client_id = configuration.eliotApp.client_id;
        this.client_secret = configuration.eliotApp.client_secret;
        this.oauthBaseEndpoint = configuration.eliotApp.oauthBaseEndpoint;
        this.oauthRedirectEndpoint = configuration.eliotApp.oauthRedirectEndpoint;
    }

    authenticateMock(loginEntry): Promise<string> {
      return Promise.resolve("a3116453-afd4-4dd5-bfc7-983d048ad098");
    }

    authorize(window): Promise<any> {
        var oauthBaseEndpoint: string = this.oauthBaseEndpoint;
        var client_id: string = this.client_id;
        var oauthRedirectEndpoint: string = this.oauthRedirectEndpoint;
        return new Promise(function(resolve, reject) {
            var browserRef = window.cordova.InAppBrowser.open(oauthBaseEndpoint + "/authorize" + 
                "?client_id=" + client_id + 
                "&redirect_uri=" + oauthRedirectEndpoint + 
                "&response_type=code", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
            browserRef.addEventListener("loadstart", (event) => {
                if ((event.url).indexOf(oauthRedirectEndpoint) === 0) {
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
        })
    }

    getToken(authorizationCode): Promise<string> {
      const requestTokenBody = new HttpParams()
          .set('client_id', this.client_id)
          .set('grant_type', "authorization_code")
          .set('code', authorizationCode)
          .set('client_secret', this.client_secret);
      return this.post(this.oauthBaseEndpoint + "/token", requestTokenBody, true).then(
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
