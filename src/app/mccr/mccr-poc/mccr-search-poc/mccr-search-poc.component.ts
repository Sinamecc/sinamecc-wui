import { Component, OnInit } from '@angular/core';
import { MccrPoc, VerifyResponse } from '@app/mccr/mccr-poc/mccr-poc';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { MccrPocNewDeveloperAccountComponent } from '@app/mccr/mccr-poc/mccr-poc-new-developer-account/mccr-poc-new-developer-account.component';
import { MccrPocNewBuyerAccountComponent } from '@app/mccr/mccr-poc/mccr-poc-new-buyer-account/mccr-poc-new-buyer-account.component';
import { UccVerifyDataComponent } from '../ucc-verify-data/ucc-verify-data.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mccr-search-poc',
  templateUrl: './mccr-search-poc.component.html',
  styleUrls: ['./mccr-search-poc.component.scss'],
  standalone: false,
})
export class MccrSearchPocComponent implements OnInit {
  idMccrPoc: string;
  mccr_poc: MccrPoc;
  isLoading: boolean;
  id: string;
  verifyingState = false;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {}

  openDialogDeveloper(): void {
    this.dialog.open(MccrPocNewDeveloperAccountComponent, {
      width: '70%',
    });
  }

  openDialogBuyer(): void {
    this.dialog.open(MccrPocNewBuyerAccountComponent, {
      width: '70%',
    });
  }

  openVerifyDialog(data: VerifyResponse) {
    this.dialog.open(UccVerifyDataComponent, {
      width: '70%',
      data: {
        verifyResponse: data,
      },
    });
  }
  search(value: string) {
    this.isLoading = true;
    this.service
      .getMccrPoc(value.trim(), this.i18nService.language.split('-')[0])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(
        (response: MccrPoc) => {
          this.mccr_poc = response;
        },
        (error) => {
          this.snackBar.open(error.error.message, null, { duration: 3000 });
        },
      );
  }

  view(uuid: string) {
    this.router.navigate([`/mccr/poc/detail/${uuid}`], { replaceUrl: true });
  }

  verify(uuid: string) {
    this.verifyingState = true;
    this.service
      .verifyUCC(uuid.trim())
      .pipe(
        finalize(() => {
          this.verifyingState = false;
        }),
      )
      .subscribe(
        (response) => {
          this.openVerifyDialog(response);
        },
        (error) => {
          this.translateService.get('errorLabel.error400').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
        },
      );
  }

  cancel(uuid: string) {
    this.isLoading = true;
    this.service.cancelUcc(uuid).subscribe(() => {
      this.isLoading = false;
      this.translateService.get('Sucessfully cancel element').subscribe((res: string) => {
        this.snackBar.open(res, null, { duration: 3000 });
      });
    });
  }

  openDeleteConfirmationDialog(uuid: string) {
    const data = {
      title: 'Cancel UCC',
      question: 'Are you sure?',
      uuid: uuid,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cancel(uuid);
      }
    });
  }

  addUCC() {
    this.router.navigate([`/mccr/poc/new`], { replaceUrl: true });
  }
}
