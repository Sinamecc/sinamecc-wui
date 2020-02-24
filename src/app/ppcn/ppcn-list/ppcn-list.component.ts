import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { I18nService, AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

export class PpcnSource extends DataSource<any> {

  ppcns: Ppcn[];
  ppcns$: Observable<Ppcn[]>;

  constructor(private service: PpcnService,
              private i18nService: I18nService, ) {
    super();
  }
  connect(): Observable < Ppcn[] > {
    this.ppcns$ = this.service.reRoutePpcn(this.i18nService.language.split('-')[0]);
    this.ppcns$.subscribe((ppcns) => {
      this.ppcns = ppcns;
    });
    return this.ppcns$;
  }
  disconnect() {}
}

@Component({
  selector: 'app-ppcn-list',
  templateUrl: './ppcn-list.component.html',
  styleUrls: ['./ppcn-list.component.scss']
})
export class PpcnListComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  displayedColumns = ['id_ppcn',
                      'organization_ppcn',
                      'request_type',
                      'fsm_state',
                      'required_recognition',
                      'geographic_level',
                      'actions'];
  dataSource: MatTableDataSource<Ppcn>;

  fieldsToSearch: string[][] = [ ['id'], ['organization', 'name'],
                              ['fsm_state'],
                              ['required_level', 'level_type'],
                              ['recognition_type', 'recognition_type'],
                              ['geographic_level', 'level'] ];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private router: Router,
    private i18nService: I18nService,
    private service: PpcnService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.reRoutePpcn(this.i18nService.language.split('-')[0]).subscribe((ppcns: Ppcn[]) => {
      const ppcnList = ppcns;
      this.dataSource = new MatTableDataSource<Ppcn>(ppcnList);
      this.dataSource.paginator = this.paginator;
    });
  }

  view(uuid: string) {
    console.log(this.dataSource.data);
    this.router.navigate([`/ppcn/${uuid}`], { replaceUrl: true });
  }

  delete(uuid: string) {
    this.isLoading = true;
     this.service.deletePpcn(uuid).subscribe(() => {
       // here i need to refresh table
       this.isLoading = false;
       this.loadData();
     } );

   }

  update(uuid: string) {
    this.router.navigate([`ppcn/${uuid}/edit`], { replaceUrl: true });
  }

  addReview(uuid: string) {
    this.dataSource.data.find;
    const selectedPpcn = this.dataSource.data.find((PPCN) => PPCN.id === uuid);
    const status = selectedPpcn.fsm_state;

    const route = this.service.mapRoutesStatuses(uuid).find(x => x.status === status );
    if (route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`ppcn/${uuid}/review/status/new`], { replaceUrl: true });
    }

  }

  changelog(uuid: string) {
    this.router.navigate([`ppcn/${uuid}/reviews`], { replaceUrl: true });
  }

  openDeleteConfirmationDialog(uuid: string) {
    const data = {
      title: 'ppcn.deletePPCN',
      question: 'general.youSure',
      uuid: uuid
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(uuid);
      }
    });
  }

  canChangeState(element: Ppcn) {
    if (!(element.fsm_state === 'PPCN_end' ||
          element.fsm_state === 'PPCN_send_recognition_certificate') ) {
      // is admin
      if (Boolean(this.authenticationService.credentials.permissions.all) ) {
        return true;
      } else {
        //It is not a
        if (!Boolean(this.authenticationService.credentials.permissions.ppcn.provider) ) {
          return true;
        }
      }
    }
    return false;
  }


  hasPermProvider() {
    return Boolean(this.authenticationService.credentials.permissions.all ||
                   this.authenticationService.credentials.permissions.ppcn.provider);
  }

}



