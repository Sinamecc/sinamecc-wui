import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material'

const log = new Logger('Report');


import { ReportService, Reports, Report } from './report.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  listOfReports: Reports;
  dataSource: MatTableDataSource<Report>;
  displayedColumns = ['report_file_id', 'name', 'last_active_version', 'versions'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private i18nService: I18nService,
    private reportService: ReportService) { }

  ngOnInit() {
    this.reports();
   }

   ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  reports() {
    this.isLoading = true;
    this.reportService.reports()
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.listOfReports =  response; 
      this.dataSource = new MatTableDataSource<Report>(this.listOfReports.reports);
    }, error => {
      log.debug(`Report File error: ${error}`);
      this.error = error;
    });

  }

}
