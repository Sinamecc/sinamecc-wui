import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { ReportService, Version } from '@app/report/report.service';
import { Router, ActivatedRoute } from '@angular/router';

const log = new Logger('Report');

export class ReportVersionsDataSource extends DataSource<any> {
  id: number;
  constructor(
    private reportService: ReportService,
    private current_id: number,
  ) {
    super();
    this.id = current_id;
  }
  connect(): Observable<Version[]> {
    return this.reportService.versions(this.id);
  }
  disconnect() {}
}

@Component({
  selector: 'app-report-versions',
  templateUrl: './report-versions.component.html',
  styleUrls: ['./report-versions.component.scss'],
  standalone: false,
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

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private reportService: ReportService,
    private route: ActivatedRoute,
  ) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.reportFileName = this.reportService.reportVersionsName(this.id);
  }

  ngOnInit(): void {}

  async download(file: string) {
    this.isLoading = true;
    const blob = await this.reportService.downloadResource(file, 'file');
    const url = window.URL.createObjectURL(blob.data);
    const a = document.createElement('a');
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
