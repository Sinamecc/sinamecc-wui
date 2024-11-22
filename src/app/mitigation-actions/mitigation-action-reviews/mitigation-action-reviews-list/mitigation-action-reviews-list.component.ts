import { Component, OnInit } from '@angular/core';
import { MitigationActionReview } from '@app/mitigation-actions/mitigation-action-review';
import { Observable } from 'rxjs';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { DataSource } from '@angular/cdk/collections';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';

export class MitigationActionReviewSource extends DataSource<any> {
  id: string;

  constructor(
    private service: MitigationActionsService,
    private current_id: string,
  ) {
    super();
    this.id = current_id;
  }

  connect(): Observable<MitigationActionReview[]> {
    return this.service.mitigationActionReviews(this.id);
  }
  disconnect() {}
}

@Component({
  selector: 'app-mitigation-action-reviews-list',
  templateUrl: './mitigation-action-reviews-list.component.html',
  styleUrls: ['./mitigation-action-reviews-list.component.scss'],
})
export class MitigationActionReviewsListComponent implements OnInit {
  id: string;
  version: string = environment.version;
  error: string;
  isLoading = false;
  reviews: any[];
  dataSource = new MitigationActionReviewSource(this.service, this.route.snapshot.paramMap.get('id'));
  displayedColumns = ['date', 'current_status', 'previous_state'];

  constructor(
    private route: ActivatedRoute,
    private service: MitigationActionsService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.service.mitigationActionReviews(this.id).subscribe((response) => {
      this.reviews = response;
    });
  }
}
