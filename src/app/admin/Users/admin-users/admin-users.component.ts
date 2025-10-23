import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserResponse } from '../../users';
import { AdminService } from '../../admin.service';
import { Role } from '../../roles';
import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { AdminUserDetailComponent } from '../admin-user-detail/admin-user-detail.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  standalone: false,
})
export class AdminUsersComponent implements OnInit {
  displayedColumns = ['username', 'email', 'roles', 'action'];
  dataSource: MatTableDataSource<User>;
  fieldsToSearch: string[][] = [['username'], ['email']];
  roles: Role[];
  roles$: Observable<Role[]>;
  totalItems = 0;
  offset = 0;
  limit = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * this.limit;
    this.loadUsers();
  }

  openDeleteConfirmationDialog(id: string) {
    const data = {
      title: 'Delete User',
      question: 'general.youSure',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeUser(id);
      }
    });
  }

  openUserDetail(user: string) {
    const dialogRef = this.dialog.open(AdminUserDetailComponent, {
      width: '70%',
      height: '90%',
      data: {
        user: user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.adminService.users({ limit: this.limit, offset: this.offset }).subscribe((response: UserResponse) => {
      const usersList = response.users.map((user: User) => ({
        ...user,
        joinedRoles: user.roles.map((r: any) => r.role_name).join(', '),
      }));
      this.totalItems = response.total;
      this.dataSource = new MatTableDataSource<User>(usersList);
    });
  }

  openSnackBar(durationSeconds: number, message: string) {
    this.translateService.get(message).subscribe((res: string) => {
      this.snackBar.open(res, null, {
        duration: 1000 * durationSeconds,
      });
    });
  }

  removeUser(id: string) {
    this.adminService.removeUser(id).subscribe(
      (response) => {
        this.openSnackBar(3, 'admin.createUserSuccess');
        this.loadUsers();
      },
      (error) => {
        this.openSnackBar(3, 'admin.createUserError');
      },
    );
  }
}
