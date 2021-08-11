import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { DataSource } from '@angular/cdk/table';
import { TranslateService } from '@ngx-translate/core';
import { CredentialsService } from '@app/auth';
import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';

const log = new Logger('Report');

export class MitigationActionSource extends DataSource<any> {
  mitigationActions: MitigationAction[];
  mitigationActions$: Observable<MitigationAction[]>;

  constructor(private service: MitigationActionsService, private i18nService: I18nService) {
    super();
  }
  connect(): Observable<MitigationAction[]> {
    this.mitigationActions$ = this.service.mitigationActions(this.i18nService.language.split('-')[0]);
    this.mitigationActions$.subscribe((mitigationActions) => {
      this.mitigationActions = mitigationActions;
    });
    return this.mitigationActions$;
  }
  disconnect() {}
}

@Component({
  selector: 'app-mitigation-actions-list',
  templateUrl: './mitigation-actions-list.component.html',
  styleUrls: ['./mitigation-actions-list.component.scss'],
})
export class MitigationActionsListComponent implements OnInit {
  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource: MatTableDataSource<MitigationAction>;
  canUpdateStatus = false;
  displayedColumns = ['name', 'strategy_name', 'purpose', 'fsm_state', 'updated', 'created', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  fieldsToSearch: string[][] = [['name'], ['strategy_name'], ['purpose'], ['fsm_state'], ['created'], ['updated']];

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.loadMAData();
  }

  view(uuid: string) {
    this.router.navigate([`/mitigation/actions/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/edit`], {
      replaceUrl: true,
    });
  }

  loadMAData() {
    this.service.mitigationActions(this.i18nService.language.split('-')[0]).subscribe((mas: MitigationAction[]) => {
      const maList = mas;
      this.dataSource = new MatTableDataSource<MitigationAction>(maList);
      this.dataSource.paginator = this.paginator;
    });
  }

  addReview(uuid: string) {
    const selectedMitigationAction = this.dataSource.data.find((ma) => ma.id === uuid);
    const status = selectedMitigationAction.fsm_state;

    const route = this.service.mapRoutesStatuses(uuid).find((x) => x.status === status);
    if (route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`mitigation/actions/${uuid}/reviews/new`], {
        replaceUrl: true,
      });
    }
  }

  changelog(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], {
      replaceUrl: true,
    });
  }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMitigationAction(uuid).subscribe(() => {
      // here i need to refresh table
      this.isLoading = false;
      this.loadMAData();
      this.translateService.get('Sucessfully deleted element').subscribe((res: string) => {
        this.snackBar.open(res, null, { duration: 3000 });
      });
    });
  }

  openDeleteConfirmationDialog(uuid: string) {
    const data = {
      title: 'mitigationAction.deleteMA',
      question: 'general.youSure',
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
        this.delete(uuid);
      }
    });
  }

  hasPermProvider() {
    return Boolean(
      this.credentialsService.credentials.permissions.all || this.credentialsService.credentials.permissions.ma.provider
    );
  }

  canChangeState(element: MitigationAction) {
    if (element.fsm_state !== 'end') {
      // is admin
      if (Boolean(this.credentialsService.credentials.permissions.all)) {
        return true;
      } else {
        if (!Boolean(this.credentialsService.credentials.permissions.ma.provider)) {
          return true;
        }
      }
    }
    return false;
  }
}
