import { TestBed, inject } from '@angular/core/testing';

import { FanEspService } from './fan-esp.service';

describe('FanEspServiceImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FanEspService]
    });
  });

  it('should be created', inject([FanEspService], (service: FanEspService) => {
    expect(service).toBeTruthy();
  }));
});
