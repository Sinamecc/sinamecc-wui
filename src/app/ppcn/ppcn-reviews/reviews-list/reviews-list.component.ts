import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { PpcnReview } from '@app/ppcn/ppcn-review';
import { Router, ActivatedRoute } from '@angular/router';

export class PpcnReviewSource extends DataSource<any> {
  id: string;

  constructor(private service: PpcnService,
              private current_id: string) {
      super();
      this.id = current_id;

  }


  connect(): Observable < PpcnReview[] > {
    return this.service.ppcnReviews(this.id);
  }
  disconnect() {}
}
@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {

  id: string;
  version: string = environment.version;
  error: string;
  isLoading = false;

  dataSource = new PpcnReviewSource(this.service, this.route.snapshot.paramMap.get('id'));

  displayedColumns = ['date', 'current_status', 'previous_state'];

  constructor( private router: Router,
    private route: ActivatedRoute,
    private service: PpcnService, ) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
  }

}


