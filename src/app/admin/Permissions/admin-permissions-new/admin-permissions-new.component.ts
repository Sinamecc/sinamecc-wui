import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '@app/admin/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Permissions } from '@app/admin/permissions';

const log = new Logger('CreatePermission');

@Component({
  selector: 'app-admin-permissions-new',
  templateUrl: './admin-permissions-new.component.html',
  styleUrls: ['./admin-permissions-new.component.scss'],
})
export class AdminPermissionsNewComponent implements OnInit {
  createPermissionsForm: FormGroup;
  isLoading = false;
  error: string;

  contentTypeMap: Map<string, number>;

  @Input() edit: boolean;
  @Input() editData: Permissions;

  name: string;

  constructor(
    private formBuilder: FormBuilder,
    private service: AdminService,
    private translateService: TranslateService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
    this.contentTypeMap = new Map<string, number>();
    this.contentTypeMap.set('mccr', 1);
    this.contentTypeMap.set('ma', 2);
    this.contentTypeMap.set('ppcn', 3);
    this.contentTypeMap.set('report', 4);
    this.name = '';
  }

  ngOnInit(): void {
    this.setData();
  }

  setData() {
    if (this.edit) {
      this.name = this.editData.name;
    }
  }

  submitForm(value: string) {
    this.createPermissionsForm.value.codename = `${value}_${this.createPermissionsForm.value.name.replace(
      new RegExp(' ', 'g'),
      '_'
    )}`;
    this.createPermissionsForm.value.content_type = this.contentTypeMap.get(value);

    if (this.createPermissionsForm.value.name.length <= 80) {
      if (this.edit) {
      } else {
        this.isLoading = true;
        this.service
          .submitCreatePermissions(this.createPermissionsForm.value)
          .pipe(
            finalize(() => {
              this.createPermissionsForm.markAsPristine();
              this.isLoading = false;
            })
          )
          .subscribe(
            (response) => {
              this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
                this.snackBar.open(res, null, { duration: 3000 });
              });
              log.debug(`${response.statusCode} status code received from create permissions `);
              this.router.navigate([`/home`], { replaceUrl: true });
            },
            (error) => {
              log.debug(`Create permission error: ${error}`);
              this.error = error;
            }
          );
      }
    }
  }

  private createForm() {
    this.createPermissionsForm = this.formBuilder.group({
      name: ['', Validators.required],
      codename: ['', Validators.required],
      content_type: ['', Validators.required],
    });
  }
}
