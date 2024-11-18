import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { User } from '@app/admin/users';
import { PermissionsDataSource } from '@app/admin/Users/tablePermissions';
import { AdminService } from '@app/admin/admin.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss'],
})
export class AdminUserDetailComponent implements OnInit {
  userDetail: User;
  user: any;
  isLoading: boolean;
  displayedColumns = ['name', 'content_type', 'action'];
  dataSource = new PermissionsDataSource(this.adminService);

  constructor(
    private adminService: AdminService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    if (data) {
      this.user = data.user;
    }
  }

  ngOnInit(): void {}

  getUser(username: string) {
    this.adminService
      .user(username)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: User) => {
        this.userDetail = response;
      });
  }
}
