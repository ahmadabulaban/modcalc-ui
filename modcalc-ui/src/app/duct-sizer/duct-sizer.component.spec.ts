import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuctSizerComponent } from './duct-sizer.component';

describe('DuctSizerComponent', () => {
  let component: DuctSizerComponent;
  let fixture: ComponentFixture<DuctSizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuctSizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuctSizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
