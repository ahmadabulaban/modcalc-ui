import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FanPopupTypeComponent} from '../fan-popup-type/fan-popup-type.component';

@Component({
  selector: 'app-fan-popup-coefficient',
  templateUrl: './fan-popup-coefficient.component.html',
  styleUrls: ['./fan-popup-coefficient.component.css']
})
export class FanPopupCoefficientComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FanPopupTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  selectCoefficient(cf) {
    this.dialogRef.close(cf);
  }
}
