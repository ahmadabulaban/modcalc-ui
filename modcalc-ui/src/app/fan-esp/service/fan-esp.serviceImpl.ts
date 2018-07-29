import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FanEspRequest} from '../models/request/fan-esp-request.model';
import {FanEspService} from './fan-esp.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FanEspLookup} from '../models/lookups/fan-esp-lookup.model';
import {FanEspCoefficientLookup} from '../models/lookups/fan-esp-coefficient-lookup.model';
import {FanEspCoefficientDataLookup} from '../models/lookups/fan-esp-coefficient-data-lookup.model';
import {FanEspSaveRequest} from '../models/request/fan-esp-save-request.model';
import {FanEspLoadResponse} from '../models/response/fan-esp-load-response.model';

@Injectable()
export class FanEspServiceImpl extends FanEspService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    // Production Url
    this.baseUrl = 'http://ec2-34-243-32-121.eu-west-1.compute.amazonaws.com';
    this.baseUrl = '/modcalc-production/fan-esp/';
    // Development Url
    // this.baseUrl = '/modcalc-controller/fan-esp/';
  }

  calculateFanEsp(body: FanEspRequest): Observable<any> {
    return this.http.post<FanEspRequest>(this.baseUrl + 'calculate', body)
      .catch(this.handleError);
  }

  saveFanEsp(body: FanEspSaveRequest): Observable<any> {
    return this.http.post<FanEspSaveRequest>(this.baseUrl + 'save', body)
      .catch(this.handleError);
  }

  getSavedFanEsp(): Observable<FanEspLoadResponse[]> {
    return this.http.get<FanEspLoadResponse[]>(this.baseUrl + 'load')
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
    return Observable.throw(error.error);
  }
}
