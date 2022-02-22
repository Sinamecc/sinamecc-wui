import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReportService, Report } from '@app/report/report.service';
import { Logger } from '@app/@core';

const log = new Logger('Report');

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
  displayedColumns = ['name', 'email'];
  fieldsToSearch: string[][] = [['name'], ['email']];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // this.loadReportData();
  }

  loadReportData() {
    this.reportService.reports().subscribe((reports: Report[]) => {
      const reportList = reports;
      this.dataSource = new MatTableDataSource<Report>(reportList);
      this.dataSource.paginator = this.paginator;
    });
  }
}
