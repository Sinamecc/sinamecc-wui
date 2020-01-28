import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../users';
import { AdminService } from '../../admin.service';
import { MatPaginator, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { AdminUserDetailComponent } from '../admin-user-detail/admin-user-detail.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  displayedColumns = ['username', 'email','is_active','is_provider','is_administrador_dcc','action'];
  dataSource:MatTableDataSource<User>

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService:AdminService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadUsers()
  }

  openDeleteConfirmationDialog() {
    const data = {
      title: "Delete User",
      question: "general.youSure",
      
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    let dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
       
      }
    });
  }

  openUserDetail(user:string){
    let dialogRef = this.dialog.open(AdminUserDetailComponent, {
      width: '70%',
      data: {
        user : user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadUsers()
    });
  }

  loadUsers(){
    this.adminService.users().subscribe((users) => {
      const usersList = users;
      this.dataSource = new MatTableDataSource<User>(usersList);
      this.dataSource.paginator = this.paginator
    });
  }

}


