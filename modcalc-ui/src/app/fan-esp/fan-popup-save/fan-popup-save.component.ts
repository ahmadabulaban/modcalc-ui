import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fan-popup-save',
  templateUrl: './fan-popup-save.component.html',
  styleUrls: ['./fan-popup-save.component.css']
})
export class FanPopupSaveComponent implements OnInit {
  name: string;

  constructor(public dialogRef: MatDialogRef<FanPopupSaveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  saveInput(name) {
    this.dialogRef.close(name);
  }
}
