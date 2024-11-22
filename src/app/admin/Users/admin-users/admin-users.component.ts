import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../users';
import { AdminService } from '../../admin.service';
import { Role } from '../../roles';

import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { AdminUserDetailComponent } from '../admin-user-detail/admin-user-detail.component';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export class UsersDataSource extends DataSource<any> {
  users: User[];
  users$: Observable<User[]>;

  constructor(private adminService: AdminService) {
    super();
  }

  connect(): Observable<User[]> {
    this.users$ = this.adminService.users();
    this.users$.subscribe((ppcns) => {
      this.users = ppcns;
    });
    return this.users$;
  }
  disconnect() {}
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  displayedColumns = ['username', 'email', 'roles', 'action'];
  dataSource: MatTableDataSource<User>;
  fieldsToSearch: string[][] = [['username'], ['email']];
  roles: Role[];
  roles$: Observable<Role[]>;

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
    this.adminService.users().subscribe((users: User[]) => {
      const usersList = users;
      usersList.forEach((user: User) => {
        user['joinedRoles'] = user.roles.map((role: any) => role.role_name).join(', ');
      });
      this.dataSource = new MatTableDataSource<User>(usersList);
      this.dataSource.paginator = this.paginator;
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
