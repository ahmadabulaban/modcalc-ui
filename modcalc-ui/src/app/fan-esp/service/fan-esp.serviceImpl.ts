import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FanEspRequest} from '../models/request/fan-esp-request.model';
import {FanEspService} from './fan-esp.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FanEspLookup} from '../models/lookups/fan-esp-lookup.model';
import {FanEspCoefficientLookup} from '../models/lookups/fan-esp-coefficient-lookup.model';
import {FanEspCoefficientDataLookup} from '../models/lookups/fan-esp-coefficient-data-lookup.model';

@Injectable()
export class FanEspServiceImpl extends FanEspService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    // Production Url
    this.baseUrl = 'http://ec2-34-243-32-121.eu-west-1.compute.amazonaws.com';
    this.baseUrl = '/modcalc-deployment-draft2/fan-esp/';
    // Development Url
    // this.baseUrl = '/modcalc-controller/fan-esp/';
  }

  calculateFanEsp(body: FanEspRequest): Observable<any> {
    return this.http.post<FanEspRequest>(this.baseUrl + 'calculate', body)
      .catch(this.handleError);
  }

  getFanEspLookup(): Observable<FanEspLookup[]> {
    return this.http.get<FanEspLookup[]>(this.baseUrl + 'lookup')
      .catch(this.handleError);
  }

  getFanEspCoefficientLookup(): Observable<FanEspCoefficientLookup[]> {
    return this.http.get<FanEspCoefficientLookup[]>(this.baseUrl + 'lookup-coefficient')
      .catch(this.handleError);
  }

  getFanEspCoefficientDataLookup(): Observable<FanEspCoefficientDataLookup[]> {
    return this.http.get<FanEspCoefficientDataLookup[]>(this.baseUrl + 'lookup-coefficient-data')
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.log('message    [Error     ]==' + error);
    return Observable.throw(error.error);
  }
}
