import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-adaptation-action-review',
  templateUrl: './adaptation-action-review.component.html',
  styleUrls: ['./adaptation-action-review.component.scss'],
})
export class AdaptationActionReviewComponent implements OnInit {
  isLoading = false;
  id: string;
  adaptationAction: AdaptationAction;

  constructor(private route: ActivatedRoute, private service: AdaptationActionService) {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.loadAdaptationAction();
  }

  loadAdaptationAction() {
    this.isLoading = true;
    this.service.loadAdaptationActions().subscribe(
      (x) => {
        this.adaptationAction = x.find((element) => element.id === this.id);
        console.log(this.adaptationAction);
      },
      (complete) => {
        this.isLoading = false;
      }
    );
  }
}
