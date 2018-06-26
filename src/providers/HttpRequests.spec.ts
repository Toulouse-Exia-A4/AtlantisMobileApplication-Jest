import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  HttpClient,
} from '@angular/common/http';
import { HttpRequestsProvider } from './HttpRequests';
import { Storage, IonicStorageModule } from '@ionic/storage';

const mockAirports = {
  DUB: { name: 'Dublin' },
  WRO: { name: 'Wroclaw' },
  MAD: { name: 'Madrid' }
};

describe('Provider: HttpRequestsProvider', () => {
  let httpMock: HttpTestingController;
  let httpRequests: HttpRequestsProvider;
  let storage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [ HttpClientTestingModule, IonicStorageModule.forRoot() ],
        providers: [
          HttpRequestsProvider
        ]
      }
    );
  });

  beforeEach(
    inject([HttpRequestsProvider, HttpTestingController, Storage], (_httpRequests, _httpMock, _storage) => {
      httpRequests = _httpRequests;
      httpMock = _httpMock;
      storage = _storage;
  }));

  beforeEach(() => {  
    httpRequests = new HttpRequestsProvider(httpMock as any, storage);
  });

  it('BuildURLParametersString(): given null param should return empty string', () => {
    expect(httpRequests.BuildURLParametersString(null)).toBe("");
  });

  it('BuildURLParametersString(): given 0 param should return empty string', () => {
    var params = {};
    
    expect(httpRequests.BuildURLParametersString(params)).toBe("");
  });

  it('BuildURLParametersString(): given 1 param should return 1 param formatted string', () => {
    var params = {
        param1: 'value1'
    };
    
    expect(httpRequests.BuildURLParametersString(params)).toBe("?param1=value1");
  });

  it('BuildURLParametersString(): given multiple param should return multiple param formatted string', () => {
    var params = {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3'
    };
    
    expect(httpRequests.BuildURLParametersString(params)).toBe("?param1=value1&param2=value2&param3=value3");
  });
});