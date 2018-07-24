import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanPopupLoadComponent } from './fan-popup-load.component';

describe('FanPopupLoadComponent', () => {
  let component: FanPopupLoadComponent;
  let fixture: ComponentFixture<FanPopupLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanPopupLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanPopupLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
