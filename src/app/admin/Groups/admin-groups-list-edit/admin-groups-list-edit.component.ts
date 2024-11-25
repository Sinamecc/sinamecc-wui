import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Groups } from '@app/admin/groups';
import { AdminService } from '@app/admin/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-groups-list-edit',
  templateUrl: './admin-groups-list-edit.component.html',
  styleUrls: ['./admin-groups-list-edit.component.scss'],
  standalone: false,
})
export class AdminGroupsListEditComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'action'];
  dataSource: MatTableDataSource<Groups>;
  @Input() dataTable: Groups[];
  @Input() userGroups: Groups[];

  public groups: Groups[];
  public newListOfUserGroups: Groups[];
  public listOfDeleteUserGroups: Groups[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(private adminService: AdminService) {
    this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Groups>(this.dataTable);
    this.initTempList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  initTempList() {
    this.newListOfUserGroups = [];
    this.listOfDeleteUserGroups = [];
    this.groups = [];
    for (const perm of this.dataTable) {
      if (this.containsGroups(perm.id)) {
        this.newListOfUserGroups.push(perm);
        this.groups.push(perm);
      } else {
        this.listOfDeleteUserGroups.push(perm);
      }
    }
  }

  containsGroups(idGroup: string) {
    return this.userGroups.some((group) => group.id === idGroup);
  }

  add(group: Groups) {
    this.newListOfUserGroups.push(group);
    this.listOfDeleteUserGroups = this.listOfDeleteUserGroups.filter((groups) => groups.id === group.id);
    this.userGroups.push(group);
  }

  remove(group: Groups) {
    this.listOfDeleteUserGroups.push(group);
    this.newListOfUserGroups = this.newListOfUserGroups.filter((groups) => groups.id !== group.id);
    this.userGroups = this.userGroups.filter((groups) => groups.id !== group.id);
  }

  getRemoveGroups() {
    const removePerm: Groups[] = [];
    const filteredGroups = this.groups.filter((useGroup) => !this.containsGroups(useGroup.id));
    removePerm.push(...filteredGroups);
    return removePerm;
  }
}
