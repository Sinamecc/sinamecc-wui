import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { User } from '../../users';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../admin.service';
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { AdminUserDetailComponent } from '../admin-user-detail/admin-user-detail.component';


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
  disconnect() { }

}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  displayedColumns = ['username', 'email', 'is_active', 'is_provider', 'is_administrador_dcc', 'action'];
  dataSource = new UsersDataSource(this.adminService);

  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(
    private adminService: AdminService,
    public dialog: MatDialog) { }

  ngOnInit() {

  }

  openDeleteConfirmationDialog() {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openUserDetail(user: string) {
    const dialogRef = this.dialog.open(AdminUserDetailComponent, {
      width: '70%',
      data: {
        user : user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new UsersDataSource(this.adminService);
    });
  }

}
