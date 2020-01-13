import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { DataSource } from '@angular/cdk/table';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { I18nService, AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

@Component({
  selector: 'app-ppcn-list',
  templateUrl: './ppcn-list.component.html',
  styleUrls: ['./ppcn-list.component.scss','../../../customCss.scss']
})
export class PpcnListComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new PpcnSource(this.service,this.i18nService);
  displayedColumns = ['id_ppcn', 'organization_ppcn','request_type','fsm_state', 'required_recognition', 'geographic_level', 'actions'];

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: PpcnService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  view(uuid: string) {
    this.router.navigate([`/ppcn/${uuid}`], { replaceUrl: true });
  }

  delete(uuid: string) {
    this.isLoading = true;
     this.service.deletePpcn(uuid).subscribe(() =>{
       // here i need to refresh table
       this.isLoading = false;
       this.dataSource = new PpcnSource(this.service, this.i18nService);
     } );
 
   }

  getAuthenticationService(){
    return this.authenticationService;
  }
  
  update(uuid: string) {
    this.router.navigate([`ppcn/${uuid}/edit`], { replaceUrl: true });
  }

  addReview(uuid: string) {

    const selectedPpcn = this.dataSource.ppcns.find((PPCN) => PPCN.id === uuid);
    const status = selectedPpcn.fsm_state;
    
    const route = this.service.mapRoutesStatuses(uuid).find(x => x.status === status );
    if(route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`ppcn/${uuid}/review/status/new`], { replaceUrl: true });
    }
    
  }

  changelog(uuid: string) {
    this.router.navigate([`ppcn/${uuid}/reviews`], { replaceUrl: true });
  }

  openDeleteConfirmationDialog(uuid:string) {
    const data = {
      title: "ppcn.deletePPCN",
      question: "general.youSure",
      uuid: uuid
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    let dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(uuid);
      }
    });
  }

}


export class PpcnSource extends DataSource<any> {

  ppcns: Ppcn[];
  ppcns$: Observable<Ppcn[]>;

  constructor(private service: PpcnService,
              private i18nService: I18nService,) {
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
