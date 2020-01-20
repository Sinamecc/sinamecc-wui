import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';


const log = new Logger('Report');


import { ReportService, Report, Version } from '@app/report/report.service';


@Component({
  selector: 'app-report-versions',
  templateUrl: './report-versions.component.html',
  styleUrls: ['./report-versions.component.scss']
})
export class ReportVersionsComponent implements OnInit {

  version: string = environment.version;
  serverUrl: string = environment.serverUrl;
  report: number;
  error: string;
  id: number;
  isLoading = false;
  dataSource = new ReportVersionsDataSource(this.reportService, +this.route.snapshot.paramMap.get('id'));
  displayedColumns = ['version', 'file'];
  reportFileName: Observable<string>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private i18nService: I18nService,
    private reportService: ReportService,
    private route: ActivatedRoute) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.reportFileName = this.reportService.reportVersionsName(this.id);
  }

  ngOnInit() {
  }

  async download(file: string) {
    this.isLoading = true;
    const blob = await this.reportService.downloadResource(file);
    var url = window.URL.createObjectURL(blob.data);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = blob.filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.isLoading = false;
  }


}

export class ReportVersionsDataSource extends DataSource<any> {
  id: number;
  constructor(private reportService: ReportService,
    private current_id: number) {
    super();
    this.id = current_id;
  }
  connect(): Observable<Version[]> {
    return this.reportService.versions(this.id);
    // this.singleEvents$.subscribe(event => this.event = event);
    //return this.reportService.reportVersions(this.id).subscribe(versions =>this.ver)versions();
  }
  disconnect() { }
}
