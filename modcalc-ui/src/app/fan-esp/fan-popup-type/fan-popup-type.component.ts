import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fan-popup-type',
  templateUrl: './fan-popup-type.component.html',
  styleUrls: ['./fan-popup-type.component.css']
})
export class FanPopupTypeComponent implements OnInit {

  initialStart: boolean;
  dataAvailable: boolean;

  constructor(public dialogRef: MatDialogRef<FanPopupTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.initialStart = true;
    this.dataAvailable = false;
  }

  chooseType(typeName) {
    this.dialogRef.close(typeName);
  }

  startBuildPage() {
    setTimeout(() => {
      this.dataAvailable = true;
    }, 500);
  }

  checkHtmlReady(currentIndex, fullLength) {
    if (currentIndex + 1 === fullLength) {
      this.initialStart = false;
    }
  }
}
