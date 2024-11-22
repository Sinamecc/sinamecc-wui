import { Component, OnInit, Inject, Optional, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PermissionsData } from '@app/admin/permissionsData';
import { Permissions } from '../../permissions';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-permission-list',
  templateUrl: './admin-permission-list.component.html',
  styleUrls: ['./admin-permission-list.component.scss'],
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
    private snackBar: MatSnackBar,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: PermissionsData,
    private translateService: TranslateService,
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
    this.translateService.get('admin.successfullyAdded').subscribe((res: string) => {
      this.snackBar.open(`${perm.name}  ${res}`, null, { duration: 3000 });
    });
  }

  removePermissions(perm: Permissions) {
    this.removeTempPermissionsList.splice(this.removeTempPermissionsList.indexOf(perm), 1);
    this.dataSource = new MatTableDataSource<Permissions>(this.removeTempPermissionsList);
    this.removePermissionsList.push(perm);
    this.translateService.get('admin.properlyRemoved').subscribe((res: string) => {
      this.snackBar.open(`${perm.name}  ${res}`, null, { duration: 3000 });
    });
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
