import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MccrRegistry } from '@app/mccr-registries/mccr-registry';
import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';


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
    private service: MccrRegistriesService) { }

  ngOnInit() {
  }

  delete(uuid: string) {
    this.isLoading = true;
    this.service.deleteMccrRegistry(uuid).subscribe(() =>{
       // here i need to refresh table
       this.isLoading = false;
       this.dataSource = new MccrRegistriesDataSource(this.service);
     } )
   }

   view(uuid: string) {
    this.router.navigate([`/mccr/registries/${uuid}`], { replaceUrl: true });
  }

  update(uuid: string) {
    this.router.navigate([`mccr/registries/${uuid}/edit`], { replaceUrl: true });
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
