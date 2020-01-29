import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material'


const log = new Logger('Report');


import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

import { MatDialog, MatDialogConfig } from "@angular/material";
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
  dataSource:MatTableDataSource<MitigationAction>
  canUpdateStatus: boolean = false;
  displayedColumns = ['name', 'strategy_name', 'purpose', 'fsm_state', 'updated', 'created', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    this.loadMAData()
  }

  view(uuid: string) {
    this.router.navigate([`/mitigation/actions/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/edit`], { replaceUrl: true });
  }

  getAuthentification(){
    return this.authenticationService;
  }

  loadMAData(){
    this.service.mitigationActions(this.i18nService.language.split('-')[0]).subscribe((mas:MitigationAction[]) => {
      const maList = mas;
      this.dataSource = new MatTableDataSource<MitigationAction>(maList);
      this.dataSource.paginator = this.paginator
    });
  }


  addReview(uuid: string) {

    const selectedMitigationAction = this.dataSource.data.find((ma) => ma.id === uuid);
    const status = selectedMitigationAction.fsm_state;

    const route = this.service.mapRoutesStatuses(uuid).find(x => x.status === status);
    if (route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`mitigation/actions/${uuid}/reviews/new`], { replaceUrl: true });
    }

  }

  changelog(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], { replaceUrl: true });
  }

  // uploadProposal(uuid: string) {
  //   this.router.navigate([`mitigation/actions/${uuid}/conceptual/integration/new`], { replaceUrl: true });
  // }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMitigationAction(uuid).subscribe(() => {
      // here i need to refresh table
      this.isLoading = false;
      this.loadMAData();
      this.translateService.get('Sucessfully deleted element').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
    });

  }

  openDeleteConfirmationDialog(uuid: string) {
    const data = {
      title: "mitigationAction.deleteMA",
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
      if (result) {
        this.delete(uuid);
      }
    });
  }

}


