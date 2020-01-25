import { Component, OnInit, Input, ViewChild, Optional, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Groups } from '../../groups';
import { GroupsData } from '../../groupsData';

@Component({
  selector: 'app-admin-group-list',
  templateUrl: './admin-group-list.component.html',
  styleUrls: ['./admin-group-list.component.scss']
})
export class AdminGroupListComponent implements OnInit {
  displayedColumnsGroups = ['name', 'action'];
  dataSource: MatTableDataSource<Groups>;
  listOfGroups: Groups [] = [];
  componentType = 'add';

  removeGroupsList: Groups [] = [];
  removeTempGroupsList: Groups [] = [];

  @Input('dataTable') table: Groups [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: GroupsData) {

      if (this.data != null) {
        this.componentType = data.componentType;
        this.table = data.array;
        this.dataSource = new MatTableDataSource<Groups>(this.table);
      }
     }

  ngOnInit() {
    if (!this.data) {
      this.dataSource = new MatTableDataSource<Groups>(this.table);
    }
    for (const group of this.table) {
      this.removeTempGroupsList.push(group);
    }

  }

  addPermissions(group: Groups) {
    this.listOfGroups.push(group);
    this.table.splice( this.table.indexOf(group), 1 );
    this.dataSource = new MatTableDataSource<Groups>(this.table);
    this.snackBar.open(group.name + ' anadido correctamente ', 'add' , {
      duration: 2000,
    });
  }

  removePermissions(group: Groups) {
    this.removeTempGroupsList.splice( this.removeTempGroupsList.indexOf(group), 1 );
    this.dataSource = new MatTableDataSource<Groups>(this.removeTempGroupsList);
    this.removeGroupsList.push(group);
    this.snackBar.open(group.name + ' Eliminado correctamente de lista de permisos', 'remove' , {
      duration: 2000,
    });

  }

  close() {
    this.dataSource = new MatTableDataSource<Groups>(this.removeTempGroupsList);
    this.table = this.removeTempGroupsList;
    this.removeTempGroupsList = [];
  }

  searchByName(name: string) {
    const listOfGroups: Groups [] = [];
    if (name !== '') {
      for (const perm of this.table) {
          if (perm.name === name ) {
            listOfGroups.push(perm);
          }
      }
      this.dataSource = new MatTableDataSource<Groups>(listOfGroups);
    } else {
      this.dataSource = new MatTableDataSource<Groups>(this.table);
    }
  }
}
