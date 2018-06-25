import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the HttpRequests provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpRequestsProvider {

  protected ApiEndPoint = 'http://localhost:8733';

    constructor(public http: HttpClient, public storage: Storage, public loadingCtrl: LoadingController) {
        console.log('Hello HttpRequests Provider');
    }

    post(url: string, body: any): Promise<any> {
      let headerDict = {
        'Content-Type': 'application/json',
      }

      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      
      console.log("Call post " + url);
      return this.http.post(url, body, requestOptions)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    get(url: string, body: any = null): Promise<any> {
      let headerDict = {
        'Content-Type': 'application/json',
      }

      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };

      var urlGet = url + this.BuildURLParametersString(body);
      console.log("Call get " + urlGet);
      return this.http.get(urlGet, requestOptions)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    private BuildURLParametersString(parameters: any): string {
      if (!parameters || parameters == null)
        return "";

      var string = "?";

      var separator = "";
      Object.keys(parameters).forEach(key => {
        string += separator + decodeURI(key) + encodeURI(parameters[key]);
        separator = "&";
      });

      return string;
    }

    async checkUserLoggedIn() {
      return this.getTokenFromStorage()
        .then((result) => {
          if (result.length > 0) {
            return true;
          }
          else {
            return false;
          }
        })
        .catch((err) => {
          return false;
        });
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private extractData(res: Response) {
      //Convert the response to JSON format
      let body = res.json();
      //Return the data (or nothing)
      return body || {};
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private handleError(res: Response | any) {
      console.error('Entering handleError');
      console.dir(res.json());
      return Promise.reject(res.json().error || res.message || res);
    }

    public saveToken(token: string) {
      return this.storage.set("token", token);
    }

    public getTokenFromStorage() {
      return this.storage.get('token');
    }

    public clearStorage() {
      this.storage.remove("token");
    }

}
