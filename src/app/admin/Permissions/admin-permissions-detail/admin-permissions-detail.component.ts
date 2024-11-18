import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-admin-permissions-detail',
  templateUrl: './admin-permissions-detail.component.html',
  styleUrls: ['./admin-permissions-detail.component.scss'],
})
export class AdminPermissionsDetailComponent implements OnInit {
  permission: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.permission = data.perm;
    }
  }

  ngOnInit(): void {}
}
