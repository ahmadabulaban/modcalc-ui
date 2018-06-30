import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanPopupCoefficientComponent } from './fan-popup-coefficient.component';

describe('FanPopupCoefficientComponent', () => {
  let component: FanPopupCoefficientComponent;
  let fixture: ComponentFixture<FanPopupCoefficientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanPopupCoefficientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanPopupCoefficientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
