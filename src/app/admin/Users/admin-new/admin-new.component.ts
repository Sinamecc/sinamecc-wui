import { Component, OnInit, ViewChild, Input, Optional } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatSnackBar, MatDialogRef } from '@angular/material';
import { AdminPermissionListComponent } from '../../Permissions/admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from '../../Groups/admin-group-list/admin-group-list.component';
import { Permissions } from '../../permissions';
import { Logger } from '@app/core';
import { AdminService } from '../../admin.service';
import { Observable } from 'rxjs/Observable';
import { Groups } from '../../groups';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../users';
import { AdminEditPasswordDialogComponent } from '../../admin-edit-password-dialog/admin-edit-password-dialog.component';
import { AdminPermissionsListEditComponent } from '../../Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';
import { AdminGroupsListEditComponent } from '../../Groups/admin-groups-list-edit/admin-groups-list-edit.component';



const log = new Logger('CreateUser');

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss']
})
export class AdminNewComponent implements OnInit {

  permList$: Observable<Permissions[]>;
  groupsList$: Observable<Groups[]>;

  createUserForm: FormGroup;
  isLoading = false;
  error: string;

  displayedColumnsGroups = ['name', 'action'];

  @ViewChild('table') perm: AdminPermissionListComponent ;
  @ViewChild('tableGroup') group: AdminGroupListComponent;

  @ViewChild('tableEdit') permEdit: AdminPermissionsListEditComponent;
  @ViewChild('tableGroupEdit') groupEdit: AdminGroupsListEditComponent;

  @Input() edit: boolean;
  @Input() editData: User;

  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  active: boolean;
  staff: boolean;
  provider: boolean;
  dcc: boolean;

  checkList = [
    {state: false, name: 'staff'},
    {state: false, name: 'active'},
    {state: false, name: 'provider'},
    {state: false, name: 'dccUser'},
  ];

  constructor(public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<AdminNewComponent>,
    private service: AdminService,
    private formBuilder: FormBuilder,
    private router: Router, private translateService: TranslateService,
    public snackBar: MatSnackBar) {
      this.createForm();
      this.name = '';
      this.lastName = '';
      this.userName = '';
      this.email = '';
      this.password = '';
    }

  ngOnInit() {
    this.getPermissions();
    this.getGroups();
    this.setData();

  }

  setData() {
    // missing staff,
    if (this.edit) {
      this.name = this.editData.first_name;
      this.lastName = this.editData.last_name;
      this.userName = this.editData.username;
      this.email = this.editData.email;

      this.checkList[0].state = this.editData.is_staff;
      this.checkList[1].state = this.editData.is_active;
      this.checkList[2].state = this.editData.is_provider;
      this.checkList[3].state = this.editData.is_administrador_dcc;

      this.staff = this.editData.is_staff;
      this.active = this.editData.is_active;
      this.provider = this.editData.is_provider;
      this.dcc = this.editData.is_administrador_dcc;

      this.createFormEdit();

    }
  }

  openDialogPermissions(): void {
    const dialogRef = this.dialog.open(AdminPermissionListComponent, {
      width: '70%',
      data: {
        componentType : 'delete',
        array: this.perm.listOfPermissions
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        for (const perm of result) {
          this.perm.listOfPermissions.splice(this.perm.listOfPermissions.indexOf(perm), 1 );
          this.perm.dataTable.push(perm);
        }
        this.perm.dataSource = new MatTableDataSource<Permissions>(this.perm.dataTable);
      }

    });
  }


  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(AdminEditPasswordDialogComponent, {
      width: '40%',
      data: {
        componentType : 'delete',
      }
    });
  }

  openDialogGroups(): void {
    const dialogRef = this.dialog.open(AdminGroupListComponent, {
      width: '70%',
      data: {
        componentType : 'delete',
        array: this.group.listOfGroups
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        for (const group of result) {
          this.group.listOfGroups.splice(this.group.listOfGroups.indexOf(group), 1 );
          this.group.dataTable.push(group);
        }
        this.group.dataSource = new MatTableDataSource<Groups>(this.group.dataTable);
      }
    });
  }

  getPermissions() {
    this.permList$ = this.service.permissions();
  }

  getGroups() {
    this.groupsList$ = this.service.groups();
  }

  submitForm() {

    this.createUserForm.value.staff = this.checkList[0].state;
    this.createUserForm.value.active = this.checkList[1].state;
    this.createUserForm.value.provider = this.checkList[2].state;
    this.createUserForm.value.dccUser = this.checkList[3].state;
    this.isLoading = true;

    this.service.submitUser(this.createUserForm.value)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {

      this.translateService.get('Sucessfully submitted form')
        .subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from form`);
      this.submitUserDetail('permissions', this.perm.listOfPermissions);
      this.submitUserDetail('groups', this.group.listOfGroups);

    }, error => {
      log.debug(`Create user error: ${error}`);
      this.error = error;
    });
  }

  editForm() {

    this.createUserForm.value.staff = this.checkList[0].state;
    this.createUserForm.value.active = this.checkList[1].state;
    this.createUserForm.value.provider = this.checkList[2].state;
    this.createUserForm.value.dccUser = this.checkList[3].state;
    this.isLoading = true;

    this.service.editUser(this.editData.id, this.createUserForm.value)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {

      this.translateService.get('Sucessfully submitted form')
        .subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from form`);

      this.submitUserDetail('permissions', this.permEdit.newListOfUserpermission);
      this.submitDeletePermission(this.permEdit.getRemovePerm());
      this.submitUserDetail('groups', this.groupEdit.newListOfUserGroups);
      this.submitDeleteGroup(this.groupEdit.getRemoveGroups());
      this.dialogRef.close();

    }, error => {
      log.debug(`Create user error: ${error}`);
      this.error = error;
    });

  }

  submit() {
    if (this.edit) {
      this.editForm();
    } else {
      this.submitForm();
    }
  }

  submitDeleteGroup(list: any[]) {
    const tempList: string[] = [];

    for (const group of list) {
      tempList.push(group.id);
    }

    this.isLoading = true;
    this.service.deleteGroups(this.createUserForm.value, tempList)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.translateService.get('Sucessfully submitted form')
        .subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from delete groups `);
      this.router.navigate([`/home`], { replaceUrl: true });

    }, error => {
      log.debug(`Delete groups  error: ${error}`);
      this.error = error;
    });
  }

  submitDeletePermission(list: any[]) {
    const tempList: string[] = [];

    for (const perm of list) {
      tempList.push(perm.id);
    }

    this.isLoading = true;
    this.service.deletePermissions(this.createUserForm.value, tempList)
    .pipe(finalize(() => {
      this.createUserForm.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.translateService.get('Sucessfully submitted form')
        .subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from delete permissions `);
    }, error => {
      log.debug(`Delete permissions  error: ${error}`);
      this.error = error;
    });

  }

  submitUserDetail(type: string, list: any[]) {
    const tempList: string[] = [];
    const addList = list;
    let message: string;

    for (const perm of addList) {
      tempList.push(perm.id);
    }

    if (type === 'permissions') {
      this.createUserForm.value.permissions = tempList;
      message = 'permissions';
    } else {
      this.createUserForm.value.groups = tempList;
      message = 'groups';
    }

    this.isLoading = true;
    this.service.submitDetail(this.createUserForm.value, type)
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

  private createForm() {
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
      permissions: ['', Validators.required],
      groups: ['', Validators.required],
    });
  }

  private createFormEdit() {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
      staff: ['', Validators.required],
      active: ['', Validators.required],
      provider: ['', Validators.required],
      dccUser: ['', Validators.required],
      permissions: ['', Validators.required],
      groups: ['', Validators.required],
    });
  }

  checkCheckBoxvalue(event: { checked: any; }, name: string) {
    for (const value of this.checkList) {
      if (value.name === name) {
        value.state = event.checked;
      }
    }
  }
}


