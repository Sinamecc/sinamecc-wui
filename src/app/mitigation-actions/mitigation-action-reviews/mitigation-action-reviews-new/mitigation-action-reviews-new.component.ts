import { Component, OnInit } from '@angular/core';
import { MitigationActionReviewNewFormData } from '@app/mitigation-actions/mitigation-action-review-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { CredentialsService } from '@app/auth';
import { tap } from 'rxjs/operators';

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
  statusses: string[];
  shouldDisplayComment: boolean;

  processedMitigationActionsStatusses: MitigationActionReviewNewFormData;
  formValues: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private credentialsService: CredentialsService,
    private service: MitigationActionsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'mitigationAction.addReviewMA';
    this.nextRoute = `mitigation/actions`;
    this.formData = new FormData();
    this.formSubmitRoute = `/v1/mitigations/${this.id}`;
    this.statusses = [];

    this.mitigationActionObservable = this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => {
          this.mitigationAction = mitigationAction;
          if (mitigationAction.next_state) {
            this.statusses = mitigationAction.next_state.states;
            this.shouldDisplayComment = mitigationAction.next_state.required_comments;
          }
        })
      );
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
