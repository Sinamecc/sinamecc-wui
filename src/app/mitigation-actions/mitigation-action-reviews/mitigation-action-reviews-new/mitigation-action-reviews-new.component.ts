import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData, GeographicScale, Status, IngeiCompliance, Institution, FinanceSourceType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs/Observable';
import { MitigationActionReviewNewFormData, ReviewStatus } from '@app/mitigation-actions/mitigation-action-review-new-form-data';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-action-reviews-new',
  templateUrl: './mitigation-action-reviews-new.component.html',
  styleUrls: ['./mitigation-action-reviews-new.component.scss']
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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private service: MitigationActionsService) {

      this.id = this.route.snapshot.paramMap.get('id');
      this.title = "Add a new review for this mitigation action";
      this.nextRoute = `mitigation/actions`;
      this.formData = new FormData();
      this.formSubmitRoute =  `/v1/mitigations/${this.id}`;
      this.statusses = [];
      
  
      this.mitigationActionObservable = this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => {
          this.mitigationAction = mitigationAction;
          if (mitigationAction.next_state ) {
            this.statusses  = [mitigationAction.next_state];
            this.shouldDisplayComment = false;
          } else {
            this.statusses  = this.service.commonStatusses(mitigationAction);
            this.shouldDisplayComment = true;
          }
        }
      ));
    }

  ngOnInit() {
  }

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user',  String(this.authenticationService.credentials.id));
  }

}
