import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionReview } from '@app/mitigation-actions/mitigation-action-review';

@Component({
  selector: 'app-mitigation-actions-reviews-list',
  templateUrl: './mitigation-actions-reviews-list.component.html',
  styleUrls: ['./mitigation-actions-reviews-list.component.scss']
})
export class MitigationActionsReviewsListComponent implements OnInit {

  id: string;
  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new MitigationActionReviewSource(this.service, this.route.snapshot.paramMap.get('id'));

  //dataSource = new ReportVersionsDataSource(this.reportService,+this.route.snapshot.paramMap.get('id'));
  displayedColumns = ['date', 'current_status', 'previous_state'];



  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MitigationActionsService, ) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
  }

}


export class MitigationActionReviewSource extends DataSource<any> {
  id: string;

  constructor(private service: MitigationActionsService,
              private current_id: string) {
      super();
      this.id = current_id;

  }


  connect(): Observable < MitigationActionReview[] > {
    return this.service.mitigationActionReviews(this.id);
  }
  disconnect() {}
}
