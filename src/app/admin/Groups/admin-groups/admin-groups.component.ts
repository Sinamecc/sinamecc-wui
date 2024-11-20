import { Component, OnInit, ViewChild } from '@angular/core';
import { Groups } from '@app/admin/groups';
import { Observable } from 'rxjs';
import { AdminService } from '@app/admin/admin.service';
import { DataSource } from '@angular/cdk/collections';

import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

export class GroupsDataSource extends DataSource<any> {
  groups: Groups[];
  groups$: Observable<Groups[]>;

  constructor(private adminService: AdminService) {
    super();
  }

  connect(): Observable<Groups[]> {
    this.groups$ = this.adminService.groups();
    this.groups$.subscribe((groups) => {
      this.groups = groups;
    });
    return this.groups$;
  }
  disconnect() {}
}

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss'],
})
export class AdminGroupsComponent implements OnInit {
  displayedColumns = ['name', 'action'];
  dataSource: MatTableDataSource<Groups>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  fieldsToSearch: string[][] = [['label']];

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  openDeleteConfirmationDialog() {
    const data = {
      title: 'Delete Group',
      question: 'general.youSure',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);
  }

  loadGroups() {
    this.adminService.groups().subscribe((groups: Groups[]) => {
      const groupsList = groups;
      this.dataSource = new MatTableDataSource<Groups>(groupsList);
      this.dataSource.paginator = this.paginator;
    });
  }
}
