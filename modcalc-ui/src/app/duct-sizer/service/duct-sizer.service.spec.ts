import { TestBed, inject } from '@angular/core/testing';

import { DuctSizerService } from './duct-sizer.service';

describe('DuctSizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DuctSizerService]
    });
  });

  it('should be created', inject([DuctSizerService], (service: DuctSizerService) => {
    expect(service).toBeTruthy();
  }));
});
