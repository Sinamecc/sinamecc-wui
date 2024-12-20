import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '@app/admin/admin.service';
import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { AdminPermissionsDetailComponent } from '@app/admin/Permissions/admin-permissions-detail/admin-permissions-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-permissions',
  templateUrl: './admin-permissions.component.html',
  styleUrls: ['./admin-permissions.component.scss'],
  standalone: false,
})
export class AdminPermissionsComponent implements OnInit {
  displayedColumns = ['name', 'content_type', 'action'];
  dataSource: MatTableDataSource<Permissions>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fieldsToSearch: string[][] = [['name'], ['content_type']];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.adminService.permissions().subscribe((permissions: Permissions[]) => {
      const permissionsList = permissions;
      this.dataSource = new MatTableDataSource<Permissions>(permissionsList);
      this.dataSource.paginator = this.paginator;
    });
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
        perm: permission,
      },
    });
  }
}
