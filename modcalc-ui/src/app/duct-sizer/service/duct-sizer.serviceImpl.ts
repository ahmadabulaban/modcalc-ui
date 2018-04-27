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
    this.baseUrl = '/modcalc/ductsizer/';
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
    // console.log('message    [Error     ]==' + error);
    // console.log('message    [message   ]==' + error.message);
    // console.log('message    [name      ]==' + error.name);
    // console.log('message    [status    ]==' + error.status);
    // console.log('message    [statusText]==' + error.statusText);
    // console.log('message    [Error     ]==' + error.error);
    return Observable.throw(error.name + ' - ' + error.status + ' - ' + error.statusText + ' - ' + error.error.message);
  }
}
