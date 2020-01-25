import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

const log = new Logger('Report');


import { ReportService, Report } from '@app/report/report.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new ReportDataSource(this.reportService);
  displayedColumns = ['name', 'last_active_version', 'created', 'updated', 'versions'];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private reportService: ReportService
    ) { }

    ngOnInit() {

    }

    getAuthenticationService() {
      return this.authenticationService;
    }

}



export class ReportDataSource extends DataSource<any> {
  constructor(private reportService: ReportService) {
    super();
  }
  connect(): Observable < Report[] > {
    return this.reportService.reports();
  }
  disconnect() {}
}
