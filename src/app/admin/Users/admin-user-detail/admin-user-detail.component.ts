import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


import { finalize } from 'rxjs/operators';
import { User } from '@app/admin/users';
import { PermissionsDataSource } from '../tablePermissions';
import { AdminService } from '@app/admin/admin.service';



@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss']
})
export class AdminUserDetailComponent implements OnInit {

  userDetail:User
  user:any
  isLoading:boolean
  displayedColumns = ['name', 'content_type','action'];
  dataSource = new PermissionsDataSource(this.adminService);


  constructor(private adminService:AdminService,
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: any) { 
      if(data) {
        this.user = data.user; 
      }
            
    }

  ngOnInit() {
  }

  getUser(username:string){

    this.adminService.user(username)
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: User) => { this.userDetail = response; });

  }



}
