import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort, MatSnackBar} from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

const log = new Logger('Report');


import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

import {MatDialog, MatDialogConfig} from "@angular/material";
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mitigation-actions-list',
  templateUrl: './mitigation-actions-list.component.html',
  styleUrls: ['./mitigation-actions-list.component.scss']
})
export class MitigationActionsListComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new MitigationActionSource(this.service, this.i18nService);
  displayedColumns = ['name', 'strategy_name', 'purpose', 'fsm_state', 'updated', 'created', 'actions'];


  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }

  view(uuid: string) {
    this.router.navigate([`/mitigation/actions/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/edit`], { replaceUrl: true });
  }

  addReview(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews/new`], { replaceUrl: true });
  }

  changelog(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], { replaceUrl: true });
  }

  uploadProposal(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/conceptual/integration/new`], { replaceUrl: true });
  }

  delete(uuid: string) {
   this.isLoading = true;
    this.service.deleteMitigationAction(uuid).subscribe(() =>{
      // here i need to refresh table
      this.isLoading = false;
      this.dataSource = new MitigationActionSource(this.service, this.i18nService);
      this.translateService.get('Sucessfully deleted element').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
    } );

  }

  openDeleteConfirmationDialog(uuid:string) {
    const data = {
      title: "Delete Mitigation Action",
      question: "Are you sure?",
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

export class MitigationActionSource extends DataSource<any> {
  constructor(private service: MitigationActionsService,
              private i18nService: I18nService,) {
    super();
  }
  connect(): Observable < MitigationAction[] > {
    return this.service.mitigationActions(this.i18nService.language.split('-')[0]);
  }
  disconnect() {}
}
