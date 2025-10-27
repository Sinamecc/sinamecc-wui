import { Component, OnInit, Inject, Optional, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PermissionsData } from '@app/admin/permissionsData';
import { Permissions } from '../../permissions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';

@Component({
  selector: 'app-admin-permission-list',
  templateUrl: './admin-permission-list.component.html',
  styleUrls: ['./admin-permission-list.component.scss'],
  standalone: false,
})
export class AdminPermissionListComponent implements OnInit {
  displayedColumns = ['name', 'type', 'action'];
  dataSource: MatTableDataSource<Permissions>;
  listOfPermissions: Permissions[] = [];
  componentType: string;
  removePermissionsList: Permissions[] = [];
  removeTempPermissionsList: Permissions[] = [];

  @Input() dataTable: Permissions[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    public dialog: MatDialog,
    private snackBar: SnackbarService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: PermissionsData,
  ) {
    this.componentType = 'add';
    if (data != null) {
      this.componentType = data.componentType;
      this.dataTable = data.array;
      this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    }
  }

  ngOnInit(): void {
    if (!this.data) {
      this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    }
    for (const perm of this.dataTable) {
      this.removeTempPermissionsList.push(perm);
    }
  }

  addPermissions(perm: Permissions) {
    this.listOfPermissions.push(perm);
    this.dataTable.splice(this.dataTable.indexOf(perm), 1);
    this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    this.snackBar.show('admin.successfullyAdded', [perm.name]);
  }

  removePermissions(perm: Permissions) {
    this.removeTempPermissionsList.splice(this.removeTempPermissionsList.indexOf(perm), 1);
    this.dataSource = new MatTableDataSource<Permissions>(this.removeTempPermissionsList);
    this.removePermissionsList.push(perm);
    this.snackBar.show('admin.properlyRemoved', [perm.name]);
  }

  close() {
    this.dataSource = new MatTableDataSource<Permissions>(this.removeTempPermissionsList);
    this.dataTable = this.removeTempPermissionsList;
    this.removeTempPermissionsList = [];
  }

  searchByNae(name: string) {
    const listOfPerm: Permissions[] = [];
    if (name !== '') {
      for (const perm of this.dataTable) {
        if (perm.name === name) {
          listOfPerm.push(perm);
        }
      }
      return listOfPerm;
    } else {
      return this.dataTable;
    }
  }

  searchByType(type: string = 'all') {
    const listOfPerm: Permissions[] = [];
    if (type !== '0') {
      for (const perm of this.dataTable) {
        if (perm.content_type === type) {
          listOfPerm.push(perm);
        }
      }
      return listOfPerm;
    } else {
      return this.dataTable;
    }
  }

  search(name: string = '', type: string = 'all') {
    if (name === '' && type === 'all') {
      this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    } else {
      const listByName = this.searchByNae(name);
      const listByType = this.searchByType(type);
      const intersectionList = listByName.filter((value) => listByType.includes(value));
      this.dataSource = new MatTableDataSource<Permissions>(intersectionList);
    }
  }
}
