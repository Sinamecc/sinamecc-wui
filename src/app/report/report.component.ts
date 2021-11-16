import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { Logger } from '@core';

const log = new Logger('Report');

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ReportService, Report } from '@app/report/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource: MatTableDataSource<Report>;
  displayedColumns = ['name', 'last_active_version', 'created', 'updated', 'versions'];
  fieldsToSearch: string[][] = [['name'], ['last_active_version'], ['versions']];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData() {
    this.reportService.reports().subscribe((reports: Report[]) => {
      const reportList = reports;
      this.dataSource = new MatTableDataSource<Report>(reportList);
      this.dataSource.paginator = this.paginator;
    });
  }
}
