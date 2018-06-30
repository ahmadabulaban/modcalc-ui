import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanPopupTypeComponent } from './fan-popup-type.component';

describe('FanPopupTypeComponent', () => {
  let component: FanPopupTypeComponent;
  let fixture: ComponentFixture<FanPopupTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanPopupTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanPopupTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
