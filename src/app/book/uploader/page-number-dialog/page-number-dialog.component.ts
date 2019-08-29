import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'r2m-page-number-dialog',
  templateUrl: './page-number-dialog.component.html',
  styleUrls: ['./page-number-dialog.component.scss']
})
export class PageNumberDialogComponent {
  writeInNumber: number;

  constructor(
    public dialogRef: MatDialogRef<PageNumberDialogComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
