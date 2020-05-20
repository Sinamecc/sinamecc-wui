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

  @Input() dataTable: Groups [];
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
        this.dataTable = data.array;
        this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
      }
     }

  ngOnInit() {
    if (!this.data) {
      this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    }
    for (const group of this.dataTable) {
      this.removeTempGroupsList.push(group);
    }

  }

  addPermissions(group: Groups) {
    this.listOfGroups.push(group);
    this.dataTable.splice( this.dataTable.indexOf(group), 1 );
    this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
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
    this.dataTable = this.removeTempGroupsList;
    this.removeTempGroupsList = [];
  }

  searchByName(name: string) {
    const listOfGroups: Groups [] = [];
    if (name !== '') {
      for (const perm of this.dataTable) {
          if (perm.name === name ) {
            listOfGroups.push(perm);
          }
      }
      this.dataSource = new MatTableDataSource<Groups>(listOfGroups);
    } else {
      this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    }
  }
}
