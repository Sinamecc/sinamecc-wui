import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Permissions } from '@app/core/permissions';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { AdminPermissionsDetailComponent } from '../admin-permissions-detail/admin-permissions-detail.component';
import { PermissionsDataSource } from '../../Users/tablePermissions';

@Component({
  selector: 'app-admin-permissions',
  templateUrl: './admin-permissions.component.html',
  styleUrls: ['./admin-permissions.component.scss']
})
export class AdminPermissionsComponent implements OnInit {
  displayedColumns = ['name', 'content_type', 'action'];
  dataSource = new PermissionsDataSource(this.adminService);
  constructor(private adminService: AdminService, public dialog: MatDialog, ) { }

  ngOnInit() {
  }

  openDeleteConfirmationDialog() {
    const data = {
      title: 'Delete Permission',
      question: 'Are you sure?',

    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

  }

  openEditDialog(permission: Permissions) {
    const dialogRef = this.dialog.open(AdminPermissionsDetailComponent, {
      width: '60%',
      data: {
        edit: true,
        perm: permission
      }
    });
  }

}

