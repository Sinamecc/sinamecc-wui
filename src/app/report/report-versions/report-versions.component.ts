import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material'

const log = new Logger('Report');


import { ReportService, Report, Version } from './../report.service';


@Component({
  selector: 'app-report-versions',
  templateUrl: './report-versions.component.html',
  styleUrls: ['./report-versions.component.scss']
})
export class ReportVersionsComponent implements OnInit {

  version: string = environment.version;
  report: number;
  error: string;
  isLoading = false;
  listOfVersions: Version[];
  dataSource: MatTableDataSource<Version>;
  displayedColumns = ['version_name', 'file'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private i18nService: I18nService,
    private reportService: ReportService,
    private route: ActivatedRoute) { }

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
     // this.listOfVersions =  response.reports.filter(
     //   report => report.report_file_id === +this.route.snapshot.paramMap.get('id'))[0].versions; 
      //this.dataSource = new MatTableDataSource<Version>(this.listOfVersions);
    }, error => {
      log.debug(`Report File error: ${error}`);
      this.error = error;
    });

  }

}
