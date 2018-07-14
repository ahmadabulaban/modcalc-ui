import {DuctSizerService} from './duct-sizer.service';
import {DuctSizerRequest} from '../models/duct-sizer-request.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {DuctSizingLookupData} from '../models/duct-sizing-lookup-data.model';

@Injectable()
export class DuctSizerServiceImpl extends DuctSizerService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    // Production Url
    this.baseUrl = 'http://ec2-34-243-32-121.eu-west-1.compute.amazonaws.com';
    this.baseUrl = '/modcalc-deployment-draft4/duct-sizer/';
    // Development Url
    // this.baseUrl = '/modcalc-controller/duct-sizer/';
  }

  calculateDuctSizer(body: DuctSizerRequest): Observable<any> {
    return this.http.post<DuctSizerRequest>(this.baseUrl + 'calculate', body)
      .catch(this.handleError);
  }

  getDuctSizerLookupData(): Observable<DuctSizingLookupData[]> {
    return this.http.get<DuctSizingLookupData[]>(this.baseUrl + 'lookup-data')
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.log('message    [Error     ]==' + error);
    return Observable.throw(error.error);
  }
}
