import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanPopupSaveComponent } from './fan-popup-save.component';

describe('FanPopupSaveComponent', () => {
  let component: FanPopupSaveComponent;
  let fixture: ComponentFixture<FanPopupSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanPopupSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanPopupSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
