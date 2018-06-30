import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FanEspRequest} from '../models/request/fan-esp-request.model';
import {FanEspLookup} from '../models/lookups/fan-esp-lookup.model';
import {FanEspCoefficientLookup} from '../models/lookups/fan-esp-coefficient-lookup.model';
import {FanEspCoefficientDataLookup} from '../models/lookups/fan-esp-coefficient-data-lookup.model';

@Injectable()
export abstract class FanEspService {
  abstract calculateFanEsp(body: FanEspRequest): Observable<any>;
  abstract getFanEspLookup(): Observable<FanEspLookup[]> ;
  abstract getFanEspCoefficientLookup(): Observable<FanEspCoefficientLookup[]> ;
  abstract getFanEspCoefficientDataLookup(): Observable<FanEspCoefficientDataLookup[]> ;
}
