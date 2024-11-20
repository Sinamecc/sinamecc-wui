import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { CredentialsService } from '@app/auth';
import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MccrRegistriesDataSource extends DataSource<any> {
  id: number;
  mccrRegistries: MccrRegistry[];
  constructor(private service: MccrRegistriesService) {
    super();
  }
  connect(): Observable<MccrRegistry[]> {
    const mccrRegistriesPromise: Observable<MccrRegistry[]> = this.service.mccrRegistries();
    mccrRegistriesPromise.subscribe((mccrRegistries) => (this.mccrRegistries = mccrRegistries));
    return mccrRegistriesPromise;
  }
  disconnect() {}
}

@Component({
  selector: 'app-mccr-registries-list',
  templateUrl: './mccr-registries-list.component.html',
  styleUrls: ['./mccr-registries-list.component.scss'],
})
export class MccrRegistriesListComponent implements OnInit {
  version: string = environment.version;
  report: number;
  error: string;
  isLoading = false;
  dataSource: MatTableDataSource<MccrRegistry>;
  currentMccrRegistry: MccrRegistry;
  displayedColumns = ['id', 'fsm_state', 'mitigation', 'files', 'actions'];

  fieldsToSearch: string[][] = [['id'], ['mitigation'], ['fsm_state'], ['files']];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private credentialsService: CredentialsService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMCCRData();
  }

  getAuthentificationService() {
    return this.credentialsService;
  }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMccrRegistry(uuid).subscribe(() => {
      // here i need to refresh table
      this.isLoading = false;
      this.loadMCCRData();
      this.translateService.get('Sucessfully deleted element').subscribe((res: string) => {
        this.snackBar.open(res, null, {
          duration: 3000,
        });
      });
    });
  }

  view(uuid: string) {
    this.router.navigate([`/mccr/registries/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mccr/registries/${uuid}/edit`], {
      replaceUrl: true,
    });
  }

  addReview(uuid: string) {
    const selectedMccr = this.dataSource.data.find((mccr) => mccr.id === uuid);
    const status = selectedMccr.fsm_state;

    const route = this.service.mapRoutesStatuses(uuid).find((x) => x.status === status);
    if (route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`mccr/registries/${uuid}/reviews/new`], {
        replaceUrl: true,
      });
    }
  }

  openDeleteConfirmationDialog(uuid: string) {
    const data = {
      title: 'mccr.deleteMCCR',
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

  loadMCCRData() {
    this.service.mccrRegistries().subscribe((mccrs: MccrRegistry[]) => {
      const mccrList = mccrs;
      this.dataSource = new MatTableDataSource<MccrRegistry>(mccrList);
      this.dataSource.paginator = this.paginator;
    });
  }

  hasPermProvider() {
    return Boolean(
      this.credentialsService.credentials.permissions.all ||
        this.credentialsService.credentials.permissions.mccr.provider
    );
  }

  canChangeState(element: MccrRegistry) {
    if (element.fsm_state !== 'mccr_end') {
      // is admin
      if (Boolean(this.credentialsService.credentials.permissions.all)) {
        return true;
      } else {
        //It is not a
        if (!Boolean(this.credentialsService.credentials.permissions.mccr.provider)) {
          return true;
        }
      }
    }
    return false;
  }
}
