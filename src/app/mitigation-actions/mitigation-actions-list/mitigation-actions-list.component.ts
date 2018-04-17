import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material'
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

const log = new Logger('Report');


import { MitigationActionsService } from './../mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';



@Component({
  selector: 'app-mitigation-actions-list',
  templateUrl: './mitigation-actions-list.component.html',
  styleUrls: ['./mitigation-actions-list.component.scss']
})
export class MitigationActionsListComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new MitigationActionSource(this.service);
  displayedColumns = ['name', 'created', 'updated'];
  

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService
    ) { }

  ngOnInit() {
  }

}

export class MitigationActionSource extends DataSource<any> {
  constructor(private service: MitigationActionsService) {
    super();
  }
  connect(): Observable < MitigationAction[] > {
    return this.service.mitigationActions();
  }
  disconnect() {}
}