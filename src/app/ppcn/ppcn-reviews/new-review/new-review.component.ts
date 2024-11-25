import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { PpcnReviewNewFormData } from '@app/ppcn/ppcn-review-new-form-data';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { tap } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss'],
  standalone: false,
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
  statuses: string[];
  shouldDisplayComment: boolean;

  processedPpcnsstatuses: PpcnReviewNewFormData;
  formValues: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private credentialsService: CredentialsService,
    private service: PpcnService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'Add a new review for this PPCN Registry';
    this.nextRoute = `ppcn/registries`;
    this.formData = new FormData();
    this.formSubmitRoute = `/v1/ppcn/${this.id}`;
    this.statuses = [];

    this.ppcnObservable = this.service.getPpcn(this.id, this.i18nService.language.split('-')[0]).pipe(
      tap((ppcn: Ppcn) => {
        this.ppcn = ppcn;
        if (ppcn.next_state) {
          this.statuses = ppcn.next_state as any;
          this.shouldDisplayComment = false;
        } else {
          this.statuses = this.service.commonstatuses(ppcn);
          this.shouldDisplayComment = true;
        }
      }),
    );
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('comment', context.commentCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
