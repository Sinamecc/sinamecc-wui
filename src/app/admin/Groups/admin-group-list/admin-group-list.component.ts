import { Component, OnInit, Input, ViewChild, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';
import { Groups } from '@app/admin/groups';
import { GroupsData } from '@app/admin/groupsData';

@Component({
  selector: 'app-admin-group-list',
  templateUrl: './admin-group-list.component.html',
  styleUrls: ['./admin-group-list.component.scss'],
  standalone: false,
})
export class AdminGroupListComponent implements OnInit {
  displayedColumnsGroups = ['name', 'action'];
  dataSource: MatTableDataSource<Groups>;
  listOfGroups: Groups[] = [];
  componentType = 'add';

  removeGroupsList: Groups[] = [];
  removeTempGroupsList: Groups[] = [];

  @Input() dataTable: Groups[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    public dialog: MatDialog,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: GroupsData,
    private snackbar: SnackbarService,
  ) {
    if (this.data) {
      this.componentType = data.componentType;
      this.dataTable = data.array;
      this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    }
  }

  ngOnInit(): void {
    if (!this.data) {
      this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    }
    for (const group of this.dataTable) {
      this.removeTempGroupsList.push(group);
    }
  }

  addPermissions(group: Groups) {
    this.listOfGroups.push(group);
    this.dataTable.splice(this.dataTable.indexOf(group), 1);
    this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    this.snackbar.show('admin.successfullyAdded', [group.name]);
  }

  removePermissions(group: Groups) {
    this.removeTempGroupsList.splice(this.removeTempGroupsList.indexOf(group), 1);
    this.dataSource = new MatTableDataSource<Groups>(this.removeTempGroupsList);
    this.removeGroupsList.push(group);
    this.snackbar.show('admin.properlyRemoved', [group.name]);
  }

  close() {
    this.dataSource = new MatTableDataSource<Groups>(this.removeTempGroupsList);
    this.dataTable = this.removeTempGroupsList;
    this.removeTempGroupsList = [];
  }

  searchByName(name: string) {
    const listOfGroups: Groups[] = [];
    if (name !== '') {
      for (const perm of this.dataTable) {
        if (perm.name === name) {
          listOfGroups.push(perm);
        }
      }
      this.dataSource = new MatTableDataSource<Groups>(listOfGroups);
    } else {
      this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    }
  }
}
