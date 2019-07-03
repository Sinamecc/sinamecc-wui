import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Groups } from '../../groups';
import { AdminService } from '../../admin.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {
  displayedColumns = ['name','action'];
  dataSource = new GroupsDataSource(this.adminService);
  constructor(private adminService:AdminService,public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDeleteConfirmationDialog() {
    const data = {
      title: "Delete Group",
      question: "Are you sure?",
      
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    let dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);
  
  }

}

export class GroupsDataSource extends DataSource<any> {

  groups: Groups[];
  groups$: Observable<Groups[]>;

  constructor(private adminService:AdminService){
    super();
  }

  connect(): Observable<Groups[]> {
    this.groups$ = this.adminService.groups();
    this.groups$.subscribe((groups) => {
      this.groups = groups;
    });
    return this.groups$;
  }
  disconnect() { }

}