import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReportService } from '@app/report/report.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Report } from './interfaces/report';
import { CredentialsService } from '@app/auth';

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
  displayedColumns = ['name', 'email', 'contact_name', 'status', 'last_updated', 'created', 'actions'];
  fieldsToSearch: string[][] = [['name'], ['email']];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private reportService: ReportService,
    public datePipe: DatePipe,
    private router: Router,
    private credentialsService: CredentialsService
  ) {}

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

  view(uuid: string) {
    this.router.navigate([`/report/view/${uuid}`], {
      replaceUrl: true,
    });
  }

  addReview(uuid: string) {
    this.router.navigate([`/report/reviews/${uuid}/new`], {
      replaceUrl: true,
    });
  }

  hasPermProvider() {
    return Boolean(
      this.credentialsService.credentials.permissions.all || this.credentialsService.credentials.permissions.rd.provider
    );
  }

  hasPermReviewer() {
    return Boolean(
      this.credentialsService.credentials.permissions.all || this.credentialsService.credentials.permissions.rd.reviewer
    );
  }
}
