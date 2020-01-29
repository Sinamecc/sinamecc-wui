import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort, MatDialogConfig, MatDialog, MatSnackBar} from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { TranslateService } from '@ngx-translate/core';


const log = new Logger('Report');


// import { Mccr, Report, Version } from './../report.service';

@Component({
  selector: 'app-mccr-registries-list',
  templateUrl: './mccr-registries-list.component.html',
  styleUrls: ['./mccr-registries-list.component.scss']
})
export class MccrRegistriesListComponent implements OnInit {

  version: string = environment.version;
  report: number;
  error: string;
  isLoading = false;
  dataSource:MatTableDataSource<MccrRegistry>
  currentMccrRegistry: MccrRegistry;
  displayedColumns = ['id', 'fsm_state', 'mitigation', 'files', 'actions'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadMCCRData()
  }

  getAuthentificationService(){
    return this.authenticationService;
  }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMccrRegistry(uuid).subscribe(() =>{
       // here i need to refresh table
       this.isLoading = false;
       this.loadMCCRData()
       this.translateService.get('Sucessfully deleted element').subscribe((res: string) => { this.snackBar.open(res, null, {
        duration: 3000
      }); });
     } )
   }

   view(uuid: string) {
    this.router.navigate([`/mccr/registries/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mccr/registries/${uuid}/edit`], { replaceUrl: true });
  }

  // selectOvv(uuid: string) {
  //   let listedMccrRegistries = this.dataSource.mccrRegistries;
  //   let currentMccrRegistry = listedMccrRegistries.find(element => element.id === uuid);
  //   this.service.updateCurrentMccrRegistry(currentMccrRegistry);
  //   this.router.navigate([`mccr/registries/${uuid}/ovv`], { replaceUrl: true });
  // }

  addReview(uuid: string) {

    const selectedMccr = this.dataSource.data.find((mccr) => mccr.id === uuid);
    const status = selectedMccr.fsm_state;
    
    const route = this.service.mapRoutesStatuses(uuid).find(x => x.status === status );
    if(route) {
      this.router.navigate([route.route], { replaceUrl: true });
    } else {
      this.router.navigate([`mccr/registries/${uuid}/reviews/new`], { replaceUrl: true });
    }
    
  }

  openDeleteConfirmationDialog(uuid:string) {
    const data = {
      title: "mccr.deleteMCCR",
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

  loadMCCRData(){
    this.service.mccrRegistries().subscribe((mccrs:MccrRegistry[]) => {
      const mccrList = mccrs;
      this.dataSource = new MatTableDataSource<MccrRegistry>(mccrList);
      this.dataSource.paginator = this.paginator
    });
  }



}

