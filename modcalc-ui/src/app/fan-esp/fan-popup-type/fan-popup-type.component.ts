import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fan-popup-type',
  templateUrl: './fan-popup-type.component.html',
  styleUrls: ['./fan-popup-type.component.css']
})
export class FanPopupTypeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FanPopupTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  chooseType(typeName) {
    this.dialogRef.close(typeName);
  }
}
