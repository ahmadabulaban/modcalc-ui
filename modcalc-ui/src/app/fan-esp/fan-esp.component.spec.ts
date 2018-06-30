import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanEspComponent } from './fan-esp.component';

describe('FanEspComponent', () => {
  let component: FanEspComponent;
  let fixture: ComponentFixture<FanEspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanEspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
