import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

    constructor(public http: HttpClient, public storage: Storage) {
        console.log('Hello HttpRequests Provider');
    }

    post(url: string, body: any, urlEncoded?: Boolean): Promise<any> {
      let headerDict = {}
      headerDict["Content-Type"] =  urlEncoded ? 'application/x-www-form-urlencoded' : 'application/json';

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
      var urlGet = url + this.BuildURLParametersString(body);
      console.log("Call get " + urlGet);
      return this.http.get(urlGet)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    public BuildURLParametersString(parameters: any): string {
      if (!parameters || parameters == null || Object.keys(parameters).length === 0)
        return "";

      var string = "?";

      var separator = "";
      Object.keys(parameters).forEach(key => {
        string += separator + decodeURI(key) + "=" + encodeURI(parameters[key]);
        separator = "&";
      });

      return string;
    }

    async checkUserLoggedIn() {
      return this.getUserIdFromStorage()
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
      //Return the data (or nothing)
      return res || {};
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private handleError(res: Response | any) {
      console.error('Entering handleError');
      console.dir(res);
      return Promise.reject(res.message || res.error || res);
    }

    public saveUserId(userId: string) {
      return this.storage.set("userid", userId);
    }

    public getUserIdFromStorage() {
      return this.storage.get('userid');
    }

    public clearStorage() {
      this.storage.remove("userid");
    }

}
