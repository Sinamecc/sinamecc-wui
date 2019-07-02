import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Permissions } from '../../permissions';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-admin-permissions-list-edit',
  templateUrl: './admin-permissions-list-edit.component.html',
  styleUrls: ['./admin-permissions-list-edit.component.scss']
})
export class AdminPermissionsListEditComponent implements OnInit {

  displayedColumns = ['name', 'content_type','action'];
  dataSource:MatTableDataSource<Permissions>;


  @Input() userPermissions: Permissions[];
  @Input('dataTable') dataTable: Permissions [];
  public permissions:Permissions[];
  public newListOfUserpermission:Permissions[];
  public listOfDeleteUserPermission:Permissions[];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(private adminService:AdminService) { 
    this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Permissions>(this.dataTable);
    this.initTempList();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  initTempList(){
    this.newListOfUserpermission = [];
    this.listOfDeleteUserPermission = [];
    this.permissions = [];
    for(let perm of this.dataTable){
      if(this.containsPermissions(perm.id)){
        this.newListOfUserpermission.push(perm);
        this.permissions.push(perm);
      }else{
        this.listOfDeleteUserPermission.push(perm);
      }
    }
  }

  containsPermissions(idPermissions:string){
    return this.userPermissions.some(permission => permission.id== idPermissions);
  }

  add(perm:Permissions){
    this.newListOfUserpermission.push(perm);
    this.listOfDeleteUserPermission = this.listOfDeleteUserPermission.filter(permissions =>  permissions.id == perm.id);
    this.userPermissions.push(perm);
  }
  remove(perm:Permissions){
    this.listOfDeleteUserPermission.push(perm);
    this.newListOfUserpermission = this.newListOfUserpermission.filter(permissions =>  permissions.id != perm.id);
    this.userPermissions=this.userPermissions.filter(permissions =>  permissions.id != perm.id);
  }

  getRemovePerm(){
    const removePerm:Permissions[] = [];
    const filteredPerms = this.permissions.filter(useGroup => !this.containsPermissions(useGroup.id));
    removePerm.push(...filteredPerms);
    return removePerm;
  }

}
