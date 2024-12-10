import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-log-view',
  templateUrl: './change-log-view.component.html',
  styleUrls: ['./change-log-view.component.scss'],
  standalone: false,
})
export class ChangeLogViewComponent implements OnInit {
  @Input() reviews: any[];
  actualReview: any;
  constructor() {}

  ngOnInit(): void {
    if (this.reviews.length > 0) {
      this.actualReview = this.reviews[0];
      this.reviews.shift();
    }
  }
}
