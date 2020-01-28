import { Component, OnInit, ViewChild } from '@angular/core';
import { Groups } from '../../groups';
import { AdminService } from '../../admin.service';
import { MatDialogConfig, MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {
  displayedColumns = ['name','action'];
  dataSource:MatTableDataSource<Groups>

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private adminService:AdminService,public dialog: MatDialog) { }

  ngOnInit() {
    this.loadGroups()
  }

  openDeleteConfirmationDialog() {
    const data = {
      title: "Delete Group",
      question: "general.youSure",
      
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    let dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);
  
  }

  loadGroups(){
    this.adminService.groups().subscribe((groups) => {
      const groupsList = groups;
      this.dataSource = new MatTableDataSource<Groups>(groupsList);
      this.dataSource.paginator = this.paginator
    });
  }

}


