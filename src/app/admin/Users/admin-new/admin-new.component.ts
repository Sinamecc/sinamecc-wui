import { Component, OnInit, ViewChild, Input, Optional } from '@angular/core';

import { AdminPermissionListComponent } from '../../Permissions/admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from '../../Groups/admin-group-list/admin-group-list.component';
import { Permissions } from '../../permissions';
import { Logger } from '@core';
import { AdminService } from '../../admin.service';
import { Observable } from 'rxjs';
import { Groups } from '../../groups';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../users';
import { AdminEditPasswordDialogComponent } from '../../admin-edit-password-dialog/admin-edit-password-dialog.component';
import { AdminPermissionsListEditComponent } from '../../Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';
import { AdminGroupsListEditComponent } from '../../Groups/admin-groups-list-edit/admin-groups-list-edit.component';

import { Role } from '@app/admin/roles';
import { pickBy, identity } from 'lodash';
import { map } from 'rxjs/operators';
import { Response } from './../../admin.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

const log = new Logger('CreateUser');

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss'],
})
export class AdminNewComponent implements OnInit {
  permList$: Observable<Permissions[]>;
  groupsList$: Observable<Groups[]>;

  roles: Role[];
  roles$: Observable<Role[]>;
  createUserForm: FormGroup;
  roleAssignForm: FormGroup;
  isLoading = false;

  error: string;

  displayedColumnsGroups = ['name', 'action'];

  @ViewChild('table') perm: AdminPermissionListComponent;
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
  imageUrl: ArrayBuffer | string = 'assets/default_user_image.png';
  imageFile: File;

  constructor(
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AdminNewComponent>,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.name = '';
    this.lastName = '';
    this.userName = '';
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
    this.roles$ = this.loadRoles();
    this.roles$.subscribe(
      (roles: Role[]) => {
        const rolesList = roles;
        this.roles = rolesList;
        this.createForm(rolesList);
        this.setData();
      },
      (err) => {
        this.translateService.get('Error loading form information').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
        });
      }
    );
  }

  setData() {
    if (this.edit) {
      this.name = this.editData.first_name;
      this.lastName = this.editData.last_name;
      this.userName = this.editData.username;
      this.email = this.editData.email;
      this.createFormEdit();
    }
  }

  loadRoles() {
    return this.adminService.roles();
  }

  openDialogPermissions(): void {
    const dialogRef = this.dialog.open(AdminPermissionListComponent, {
      width: '70%',
      data: {
        componentType: 'delete',
        array: this.perm.listOfPermissions,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        for (const perm of result) {
          this.perm.listOfPermissions.splice(this.perm.listOfPermissions.indexOf(perm), 1);
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
        componentType: 'delete',
      },
    });
  }

  openDialogGroups(): void {
    const dialogRef = this.dialog.open(AdminGroupListComponent, {
      width: '70%',
      data: {
        componentType: 'delete',
        array: this.group.listOfGroups,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        for (const group of result) {
          this.group.listOfGroups.splice(this.group.listOfGroups.indexOf(group), 1);
          this.group.dataTable.push(group);
        }
        this.group.dataSource = new MatTableDataSource<Groups>(this.group.dataTable);
      }
    });
  }

  submitForm() {
    this.isLoading = true;

    const roles = { ...this.createUserForm.value.roles };
    const filteredRoles = Object.keys(pickBy(roles, identity));
    delete this.createUserForm.value.roles;

    this.adminService
      .submitUser(this.createUserForm.value)
      .pipe(
        map((body: any) => {
          const userId = body.body.id;
          this.submitRoles(userId, filteredRoles);
          return body;
        }),
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: Response) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);

          if (this.imageFile) {
            this.submitUserImage(response.body.id);
          } else {
            this.router.navigate([`/home`], { replaceUrl: true });
          }
          // disabled for fix issues
          // this.submitUserDetail('permissions',this.perm.listOfPermissions)
          // this.submitUserDetail('groups',this.group.listOfGroups)
        },
        (error) => {
          log.debug(`Create user error: ${error}`);
          this.error = error;
        }
      );
  }

  editForm() {
    this.isLoading = true;

    this.adminService
      .editUser(this.editData.id, this.createUserForm.value)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);

          this.submitUserDetail('permissions', this.permEdit.newListOfUserpermission);
          this.submitDeletePermission(this.permEdit.getRemovePerm());
          this.submitUserDetail('groups', this.groupEdit.newListOfUserGroups);
          this.submitDeleteGroup(this.groupEdit.getRemoveGroups());
          this.dialogRef.close();
        },
        (error) => {
          log.debug(`Create user error: ${error}`);
          this.error = error;
        }
      );
  }

  submitRoles(id: string, selectedRoles: Array<string>) {
    const context = {
      userId: id,
      roles: selectedRoles,
    };
    return this.adminService.assignRoles(context).subscribe(
      (_: any) => () => {},
      (err: any) => {
        log.debug(`Create user error: ${err}`);
        this.error = err;
      }
    );
  }

  submit() {
    if (this.edit) {
      this.editForm();
    } else {
      this.submitForm();
    }
  }

  submitUserImage(id: string) {
    this.isLoading = true;
    const context = {
      user: id,
      image: this.imageFile,
    };
    this.adminService
      .createUserImage(context)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
          this.router.navigate([`/home`], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Create user image error: ${error.error}`);
          this.error = error.error;
        }
      );
  }

  submitDeleteGroup(list: any[]) {
    const tempList: string[] = [];

    for (const group of list) {
      tempList.push(group.id);
    }

    this.isLoading = true;
    this.adminService
      .deleteGroups(this.createUserForm.value, tempList)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from delete groups `);
          this.router.navigate([`/home`], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Delete groups  error: ${error}`);
          this.error = error;
        }
      );
  }

  submitDeletePermission(list: any[]) {
    const tempList: string[] = [];

    for (const perm of list) {
      tempList.push(perm.id);
    }

    this.isLoading = true;
    this.adminService
      .deletePermissions(this.createUserForm.value, tempList)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from delete permissions `);
        },
        (error) => {
          log.debug(`Delete permissions  error: ${error}`);
          this.error = error;
        }
      );
  }

  submitUserDetail(type: string, list: any[]) {
    const tempList: string[] = [];
    const addList = list;

    for (const perm of addList) {
      tempList.push(perm.id);
    }

    this.isLoading = true;
    this.adminService
      .submitDetail(this.createUserForm.value, type)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from create user`);
          this.router.navigate([`/home`], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Create user `.concat(` error: ${error}`));
          this.error = error;
        }
      );
  }

  private createForm(roles: Array<Role>) {
    const rolesFormObj = {};
    roles.map((role) => {
      rolesFormObj[role.role] = new FormControl('');
    });
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      roles: new FormGroup(rolesFormObj),

      // permissions: ['', Validators.required],
      // groups: ['', Validators.required],
    });
  }

  private createFormEdit() {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
      // permissions: ['', Validators.required],
      // groups: ['', Validators.required],
    });
  }

  uploadImage(event: any) {
    const files = event.target.files;
    const reader = new FileReader();

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
      this.imageFile = event.target.files[0];
    };
  }
}
