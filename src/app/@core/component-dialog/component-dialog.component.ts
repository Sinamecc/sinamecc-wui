import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-component-dialog',
  templateUrl: './component-dialog.component.html',
  styleUrls: ['./component-dialog.component.scss'],
  standalone: false,
})
export class ComponentDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
