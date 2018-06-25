import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort, MatDialogConfig, MatDialog, MatSnackBar} from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MccrRegistry } from '@app/mccr-registries/mccr-registry';
import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';
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
  mediaUrl: string = environment.mediaUrl;
  report: number;
  error: string;
  isLoading = false;
  dataSource = new MccrRegistriesDataSource(this.service);
  displayedColumns = ['id', 'status', 'mitigation', 'files', 'actions'];
  
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMccrRegistry(uuid).subscribe(() =>{
       // here i need to refresh table
       this.isLoading = false;
       this.dataSource = new MccrRegistriesDataSource(this.service);
       this.translateService.get('Sucessfully deleted element').subscribe((res: string) => { this.snackBar.open(res); });
     } )
   }

   view(uuid: string) {
    this.router.navigate([`/mccr/registries/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mccr/registries/${uuid}/edit`], { replaceUrl: true });
  }

  openDeleteConfirmationDialog(uuid:string) {
    const data = {
      title: "Delete MCCR Registry",
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

export class MccrRegistriesDataSource extends DataSource<any> {
  id: number;
  constructor(private service: MccrRegistriesService) {
    super();
  }
  connect(): Observable < MccrRegistry[] > {
    return this.service.mccrRegistries();
  }
  disconnect() {}
}
