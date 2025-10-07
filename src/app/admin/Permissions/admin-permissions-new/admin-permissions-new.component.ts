import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Permissions } from '../../permissions';
import { finalize } from 'rxjs/operators';
import { AdminService } from '@app/admin/admin.service';
import { Router } from '@angular/router';
import { Logger } from '@core';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';

const log = new Logger('CreatePermission');

@Component({
  selector: 'app-admin-permissions-new',
  templateUrl: './admin-permissions-new.component.html',
  styleUrls: ['./admin-permissions-new.component.scss'],
  standalone: false,
})
export class AdminPermissionsNewComponent implements OnInit {
  createPermissionsForm: UntypedFormGroup;
  isLoading = false;
  error: string;

  contentTypeMap: Map<string, number>;

  @Input() edit: boolean;
  @Input() editData: Permissions;

  name: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: AdminService,
    private router: Router,
    public snackBar: SnackbarService,
  ) {
    this.createForm();
    this.contentTypeMap = new Map<string, number>();
    this.contentTypeMap.set('mccr', 1);
    this.contentTypeMap.set('ma', 2);
    this.contentTypeMap.set('ppcn', 3);
    this.contentTypeMap.set('report', 4);
    this.name = '';
  }

  ngOnInit() {
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
      '_',
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
            }),
          )
          .subscribe(
            (response) => {
              this.snackBar.show('Sucessfully submitted form');
              log.debug(`${response.statusCode} status code received from create permissions `);
              this.router.navigate([`/home`], { replaceUrl: true });
            },
            (error) => {
              log.debug(`Create permission error: ${error}`);
              this.error = error;
            },
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
