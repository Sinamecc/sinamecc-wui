import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatCheckbox, MatSnackBar } from '@angular/material';
import { AdminPermissionListComponent } from '../admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from '../admin-group-list/admin-group-list.component';
import { Permissions } from '../permissions';
import { I18nService, Logger } from '@app/core';
import { AdminService } from '../admin.service';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { Groups } from '../groups';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';



const log = new Logger('CreateUser');

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss']
})
export class AdminNewComponent implements OnInit {

  permList$: Observable<Permissions[]>
  groupsList$: Observable<Groups[]>

  createUserForm: FormGroup;
  isLoading = false;
  error: string;

  displayedColumnsGroups = ['name','action'];

  @ViewChild('table') perm:AdminPermissionListComponent;
  @ViewChild('tableGroup') group:AdminGroupListComponent;

  checkList = [
    {state: false,name:"staff"},
    {state: false,name:"active"},
    {state: false,name:"provider"},
    {state: false,name:"dccUser"},
  ]
  
  constructor(public dialog: MatDialog,
    private service: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,private translateService: TranslateService,
    public snackBar: MatSnackBar) {
      this.createForm();
    }

  ngOnInit() {
    this.getPermissions()
    this.getGroups()
  }

  openDialogPermissions(): void {
    let dialogRef = this.dialog.open(AdminPermissionListComponent, {
      width: '70%',
      data: {
        componentType : "delete",
        array: this.perm.listOfPermissions
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        for(let perm of result){
          this.perm.listOfPermissions.splice(this.perm.listOfPermissions.indexOf(perm), 1 );
          this.perm.dataTable.push(perm)
        }
        this.perm.dataSource = new MatTableDataSource<Permissions>(this.perm.dataTable);
      }

    }); 
  }
  openDialogGroups(): void {
    let dialogRef = this.dialog.open(AdminGroupListComponent, {
      width: '70%',
      data: {
        componentType : "delete",
        array: this.group.listOfGroups
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        for(let group of result){
          this.group.listOfGroups.splice(this.group.listOfGroups.indexOf(group), 1 );
          this.group.dataTable.push(group)
        }
        this.group.dataSource = new MatTableDataSource<Groups>(this.group.dataTable);
      }
    });
  }

  getPermissions(){
    this.permList$ = this.service.permissions()
  }

  getGroups(){
    this.groupsList$ = this.service.groups()
  }

  submitForm(){

    this.createUserForm.value.staff=this.checkList[0].state
    this.createUserForm.value.active=this.checkList[1].state
    this.createUserForm.value.provider=this.checkList[2].state
    this.createUserForm.value.dccUser=this.checkList[3].state
    this.isLoading = true;
    
    this.service.submitUser(this.createUserForm.value)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      
      this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from form`);
      this.submitUserDetail('permissions',this.perm.listOfPermissions)
      this.submitUserDetail('groups',this.group.listOfGroups)

    }, error => {
      log.debug(`Create user error: ${error}`);
      this.error = error;
    });
  }


  submitUserDetail(type:string,list:any[]){
    let tempList:string[]= [];
    let addList= list;
    let message:string;

    for(let perm of addList){
      tempList.push(perm.id)
    }

    if(type == "permissions"){
      this.createUserForm.value.permissions = tempList
      message = "permissions"
    }else{
      this.createUserForm.value.groups = tempList
      message = "groups"
    }

    this.isLoading = true;
    this.service.submitDetail(this.createUserForm.value,type)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from create user `.concat(message));
      this.router.navigate([`/home`], { replaceUrl: true });

    }, error => {
      log.debug(`Create user `.concat(message).concat(` error: ${error}`));
      this.error = error;
    });
  }

  private createForm(){

    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      staff: ['', Validators.required],
      active: ['', Validators.required],
      provider: ['', Validators.required],
      dccUser: ['', Validators.required],
      permissions:['', Validators.required],
      groups:['', Validators.required],
    });
  }

  checkCheckBoxvalue(event: { checked: any; },name:string){
    for(let value of this.checkList){
      if(value.name == name){
        value.state = event.checked
      }
    }
  }


  
  
  
}


