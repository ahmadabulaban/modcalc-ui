import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FanPopupTypeComponent} from '../fan-popup-type/fan-popup-type.component';

@Component({
  selector: 'app-fan-popup-coefficient',
  templateUrl: './fan-popup-coefficient.component.html',
  styleUrls: ['./fan-popup-coefficient.component.css']
})
export class FanPopupCoefficientComponent implements OnInit {

  initialStart: boolean;
  dataAvailable: boolean;

  constructor(public dialogRef: MatDialogRef<FanPopupTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.initialStart = true;
    this.dataAvailable = false;
  }

  selectCoefficient(cf) {
    this.dialogRef.close(cf);
  }

  startBuildPage() {
    setTimeout(() => {
      this.dataAvailable = true;
    }, 500);
  }

  checkHtmlReady(tableIndex, rowIndex, fullHeight) {
    if (tableIndex === this.data.tables.length - 1 && rowIndex === fullHeight - 1) {
      this.initialStart = false;
    }
  }
}
