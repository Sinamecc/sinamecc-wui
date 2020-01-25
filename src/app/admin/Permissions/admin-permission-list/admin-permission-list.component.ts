import { Component, OnInit, Inject, Optional, Input, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatTableDataSource, MatSnackBar, MatDialogRef, MatSort, MatPaginator } from '@angular/material';
import { Permissions } from '../../permissions';
import { PermissionsData } from '../../permissionsData';
import { I18nService } from '@app/core';
import { AdminService } from '../../admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-permission-list',
  templateUrl: './admin-permission-list.component.html',
  styleUrls: ['./admin-permission-list.component.scss']
})
export class AdminPermissionListComponent implements OnInit {
  displayedColumns = ['name', 'type', 'action'];
  dataSource: MatTableDataSource<Permissions>;
  listOfPermissions: Permissions [] = [];
  componentType: string;
  removePermissionsList: Permissions [] = [];
  removeTempPermissionsList: Permissions [] = [];

  @Input('dataTable') dataTable: Permissions [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }


  constructor(public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: PermissionsData) {
      this.componentType = 'add';
      if (data != null) {
        this.componentType = data.componentType;
        this.dataTable = data.array;
        this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
      }
    }

  ngOnInit() {
    if (!this.data) {
      this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    }
    for (const perm of this.dataTable) {
      this.removeTempPermissionsList.push(perm);
    }
  }

  addPermissions(perm: Permissions) {
    this.listOfPermissions.push(perm);
    this.dataTable.splice( this.dataTable.indexOf(perm), 1 );
    this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    this.snackBar.open(perm.name + ' anadido correctamente ', 'add' , {
      duration: 2000,
    });
  }

  removePermissions(perm: Permissions) {
    this.removeTempPermissionsList.splice( this.removeTempPermissionsList.indexOf(perm), 1 );
    this.dataSource = new MatTableDataSource<Permissions>(this.removeTempPermissionsList);
    this.removePermissionsList.push(perm);
    this.snackBar.open(perm.name + ' Eliminado correctamente de lista de permisos', 'remove' , {
      duration: 2000,
    });
  }

  close() {
    this.dataSource = new MatTableDataSource<Permissions>(this.removeTempPermissionsList);
    this.dataTable = this.removeTempPermissionsList;
    this.removeTempPermissionsList = [];
  }

  searchByNae(name: string) {
    const listOfPerm: Permissions [] = [];
    if (name !== '') {
      for (const perm of this.dataTable) {
          if (perm.name === name ) {
            listOfPerm.push(perm);
          }
      }
      return listOfPerm;
    } else {
      return this.dataTable;
    }
  }

  searchByType(type: string= 'all') {
    const listOfPerm: Permissions [] = [];
    if (type != '0') {

      for (const perm of this.dataTable) {
        if (perm.content_type === type ) {
          listOfPerm.push(perm);
        }
      }
    return listOfPerm;

    } else {
      return this.dataTable;
    }
  }
  search(name: string= '', type: string= 'all') {
    if (name === '' && type === 'all') {
      this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    } else {
      const listByName = this.searchByNae(name);
      const listByType = this.searchByType(type);
      const intersectionList = listByName.filter(value => listByType.includes(value));
      this.dataSource = new MatTableDataSource<Permissions>(intersectionList);
    }
  }
}
