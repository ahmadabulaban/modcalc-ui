import { Injectable } from '@angular/core';
import {DuctSizerRequest} from '../models/duct-sizer-request.model';
import {Observable} from 'rxjs/Observable';
import {DuctSizingLookupData} from '../models/duct-sizing-lookup-data.model';

@Injectable()
export abstract class DuctSizerService {
  abstract calculateDuctSizer(body: DuctSizerRequest): Observable<any>;
  abstract getDuctSizerLookupData(): Observable<DuctSizingLookupData[]> ;
}
