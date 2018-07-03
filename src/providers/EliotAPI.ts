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

    authenticateMock(loginEntry): Promise<any> {
      return Promise.resolve({
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJpc3MiOiJodHRwczovL2xvZ2luLmVsaW90YnlsZWdyYW5kLmNvbS8wZDg4MTZkNS0zZTdmLTRjODYtODIyOS02NDUxMzdlMGYyMjIvdjIuMC8iLCJleHAiOjE1MzAzNTMzOTgsIm5iZiI6MTUzMDM0OTc5OCwiYXVkIjoiY2QyNDYzNGUtYmUyNy00MDU5LThmMDQtMzBmZWI0YjcyYjcxIiwib2lkIjoiYTMxMTY0NTMtYWZkNC00ZGQ1LWJmYzctOTgzZDA0OGFkMDk4Iiwic3ViIjoiYTMxMTY0NTMtYWZkNC00ZGQ1LWJmYzctOTgzZDA0OGFkMDk4IiwidGZwIjoiQjJDXzFfVGhpcmRBcHAtQWNjb3VudExpbmtpbmciLCJub25jZSI6IjYzNjY1OTQ2NTY5OTQ4MjgyNC5NRGhpTm1Nek1qZ3RaVGRsWlMwMFltTTFMVGxpTldVdE9UQmxNR0UyTURsallUQTRZbUZqTWpObVpUWXRZVEE1WmkwME1UYzBMVGhsTVRVdE5EWmtaamc0WWpBM1pHSTQiLCJzY3AiOiJ0b3BvbG9neS5yZWFkIiwiYXpwIjoiOTk5OWQ4MTYtZDUzOS00NjNhLWFmYmQtN2ZjNjYzZGUxYzhhIiwidmVyIjoiMS4wIiwiaWF0IjoxNTMwMzQ5Nzk4fQ.aeLOWGtsrbBSykRdbFjWKaQarXl24SAwa1J2tGUGOgNIEh7FE2AY7zrzvMJ2FLkToXwjQRkJIxfxaF4e_C7gUkBVKnK0Jd8a2Xzo4rKGDbsEIyZXfHYg7BQrW95iiENe1ko0bZRh8FV1fRwassZZG8-T1P771L_tqLiFjGAiF55X4QPws25cCTgPzcYUTLHNPe3X1utsGQv-s1x6kFlJb_RX5Z1k4qKVZ1rcBQjYx2mZrYTW9jzfHssZWsBPKdt7a9XwoOzTrPNGcxAvIZ6eiM0zKFtad7KD3vVaulTy8X94PyhBNdcWvR1DMN_MZnQ7qPYWnajT9cBfBX0l0YHQ6g",
        refreshToken: "eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMCIsInppcCI6IkRlZmxhdGUiLCJzZXIiOiIxLjAifQ..U7rrHt3T6_8IIri8.t8OfOnzSNW6YhlU0Hl4IfnrqBY5wsneW6EVtGGYxqip1aSOUuXTOLA1vUO4DcfeuQlNWgkS9BDav3XTyzdahIqoAUiVzEY_pGrUm4GvQWiRP-dUzv6vdobjgRNoLRiUo63ywk0TZw0FuU3p4LP53_VzezciCCo5mKLkTDBzIG3WkaCkJD35u2uAX7snQDyZWwtJfPVQxNNKzab63RWBFyh3RQ3Irh2aLTdkyF829EV8jB0aHK2Qm5wgWDmDUITBK34DVIHBeJvZgT9RRyVSvo1ap27is8wuSdU41Jb8d-DuNQUxwC5c8ZW-GseZcrEpshq5E9bc6eQPAcIA4b7i2C6gwwc7h_WlVE-bRcIVfmEzbMRpTurBHcuF6xwICnUXKTqlB6VALbEuhF1HhG5Cz2uJWsDQnJGWF1ZOGxbYT3SocOX8pVK2RTk4dQ6O1EQ1b97I_ZXjlQkS7fUuHvpLw_6GfwsWK5sWwLr6bX8-ejmMcAlWZM8SC-p0l0aOyXJ_eof7mV586ldLCNFjRk7qQWyVg7RdANvPKFsr_KCvjqKrz4LZ9ffueUjuVpH1sZoxoRKhVgYF5iWoiTcZZrI60Fj0HlBKx3EsWYjf_YapmbGZ9luhgiaooNOC_CiFS8gXljGAa6XKObRUggvQWWpSXWjLNWQpjl9yv3S8v_v168e9YgYA5lN8hjkwsUzPefCTcB9z6kIsjqGA8Ty63z39gVzvJPUTA87x7wu1nacpooaq89csoFYoa_c26PFotKbenG_dZ9Psx9nAQaQ1ev9lLZQM0xe3q0YD97BivTBHuwkhFXz2WdBVpjM827GzPvCCyT-Efv9eKC2uMT_Gl7Od7Ip74eA.xxzCM7nptjVHxu3wNUVA9g"
      });
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

    getTokens(authorizationCode): Promise<any> {
      const requestTokenBody = new HttpParams()
          .set('client_id', this.client_id)
          .set('grant_type', "authorization_code")
          .set('code', authorizationCode)
          .set('client_secret', this.client_secret);
      return this.post(this.oauthBaseEndpoint + "/token", requestTokenBody, true).then(
        data => {
          return {
              token: data.access_token,
              refreshToken: data.refresh_token
            }
        },
        error => {
          Promise.reject('Could not get Token using Legrand\'s API');
        }
      )
    }

    refreshToken(): Promise<any> {
        return this.getRefreshTokenFromStorage().then(
            refreshToken => {
                const requestTokenBody = new HttpParams()
                    .set('client_id', this.client_id)
                    .set('grant_type', "refresh_token")
                    .set('refresh_token', refreshToken)
                    .set('client_secret', this.client_secret);
                    console.log(requestTokenBody);
                return this.post(this.oauthBaseEndpoint + "/token", requestTokenBody, true).then(
                    data => {
                        console.log(data);
                        return this.saveToken(data.access_token).then(
                            () => {
                                return this.saveRefreshToken(data.refresh_token).then(
                                    () => {
                                        Promise.resolve();
                                    }, error => { Promise.reject('Could not save refreshToken in storage'); }
                                )
                            }, error => { Promise.reject('Could not save token in storage'); }
                        )
                    }, error => { Promise.reject('Could not refresh Token using Legrand\'s API'); }
                )
            }, error => { Promise.reject("could not get refreshToken from storage"); }
        )
    }

}
