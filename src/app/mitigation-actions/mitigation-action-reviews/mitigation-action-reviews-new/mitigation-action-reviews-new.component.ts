import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs';
import { MitigationActionReviewNewFormData } from '@app/mitigation-actions/mitigation-action-review-new-form-data';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-action-reviews-new',
  templateUrl: './mitigation-action-reviews-new.component.html',
  styleUrls: ['./mitigation-action-reviews-new.component.scss'],
})
export class MitigationActionReviewsNewComponent implements OnInit {
  version: string = environment.version;
  error: string;

  isLoading = false;
  id: string;
  mitigationActionObservable: Observable<MitigationAction>;

  mitigationAction: MitigationAction;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;
  statuses: string[];
  shouldDisplayComment: boolean;

  processedMitigationActionsstatuses: MitigationActionReviewNewFormData;
  formValues: any;

  constructor(
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private credentialsService: CredentialsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'mitigationAction.addReviewMA';
    this.nextRoute = `mitigation/actions`;
    this.formData = new FormData();
    this.formSubmitRoute = `/v1/mitigations/${this.id}`;
    this.statuses = [];

    this.mitigationActionObservable = this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => {
          this.mitigationAction = mitigationAction;
          if (mitigationAction.next_state) {
            this.statuses = mitigationAction.next_state.states;
            this.shouldDisplayComment = mitigationAction.next_state.required_comments;
          }
        })
      );
  }

  ngOnInit() {}

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
