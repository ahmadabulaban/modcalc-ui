import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fan-popup-load',
  templateUrl: './fan-popup-load.component.html',
  styleUrls: ['./fan-popup-load.component.css']
})
export class FanPopupLoadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FanPopupLoadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  loadInput(index) {
    this.dialogRef.close(index);
  }
}
