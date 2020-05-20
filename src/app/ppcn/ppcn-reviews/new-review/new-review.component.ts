import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { PpcnReviewNewFormData, ReviewStatus } from '@app/ppcn/ppcn-review-new-form-data';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { PpcnService } from '@app/ppcn/ppcn.service';

const log = new Logger('Report');

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent implements OnInit {

  version: string = environment.version;
  error: string;

  isLoading = false;
  id: string;

  ppcnObservable: Observable<Ppcn>;
  ppcn: Ppcn;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;
  statusses: string[];
  shouldDisplayComment: boolean;

  processedPpcnsStatusses: PpcnReviewNewFormData;
  formValues: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private service: PpcnService) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.title = 'Add a new review for this PPCN Registry';
      this.nextRoute = `ppcn/registries`;
      this.formData = new FormData();
      this.formSubmitRoute =  `/v1/ppcn/${this.id}`;
      this.statusses = [];

      this.ppcnObservable = this.service.getPpcn(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((ppcn: Ppcn) => {
          this.ppcn = ppcn;
          if (ppcn.next_state ) {
            this.statusses  = ppcn.next_state.states;
            this.shouldDisplayComment = false;
          } else {
            this.statusses  = this.service.commonStatusses(ppcn);
            this.shouldDisplayComment = true;
          }
        })
      );
    }

  ngOnInit() {
  }

  onSubmission(context: any) {
    this.formData.append('comment', context.commentCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user',  String(this.authenticationService.credentials.id));
  }

}
