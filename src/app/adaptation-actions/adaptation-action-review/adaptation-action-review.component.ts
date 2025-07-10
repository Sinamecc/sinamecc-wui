import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-adaptation-action-review',
  templateUrl: './adaptation-action-review.component.html',
  styleUrls: ['./adaptation-action-review.component.scss'],
  standalone: false,
})
export class AdaptationActionReviewComponent implements OnInit {
  isLoading = false;
  id: string;
  adaptationAction: AdaptationAction;
  title: string;
  formData: FormData;
  statuses: any[];
  formSubmitRoute: string;
  nextRoute: string;
  shouldDisplayComment = false;

  constructor(
    private route: ActivatedRoute,
    private service: AdaptationActionService,
    private credentialsService: CredentialsService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'adaptationAction.addReview';
    this.formData = new FormData();
    this.statuses = [];
    this.nextRoute = `adaptation/actions`;
    this.formSubmitRoute = `/v1/adaptation-action/${this.id}/`;
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadAdaptationAction();
    }
  }

  loadAdaptationAction() {
    this.isLoading = true;
    this.service.loadOneAdaptationActions(this.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        (response) => {
          this.adaptationAction = response;
          this.statuses = this.adaptationAction.next_state;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.context.statusCtrl.state);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
