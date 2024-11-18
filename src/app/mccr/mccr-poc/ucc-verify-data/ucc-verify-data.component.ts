import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { VerifyResponse } from '../mccr-poc';

@Component({
  selector: 'app-ucc-verify-data',
  templateUrl: './ucc-verify-data.component.html',
  styleUrls: ['./ucc-verify-data.component.scss'],
})
export class UccVerifyDataComponent implements OnInit {
  verifyResponse: VerifyResponse;
  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.verifyResponse = data.verifyResponse;
  }

  ngOnInit(): void {}
}
