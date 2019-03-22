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
import { MccrRegistry } from '../mccr-registry';
import { MccrRegistriesService } from '../mccr-registries.service';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registries-review',
  templateUrl: './mccr-registries-review.component.html',
  styleUrls: ['./mccr-registries-review.component.scss']
})
export class MccrRegistriesReviewComponent implements OnInit {

  version: string = environment.version;
  error: string;

  isLoading = false;
  id: string;
  mccrRegistryObservable: Observable<MccrRegistry>;

  mccrRegistry: MccrRegistry;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;
  statusses: string[];
  shouldDisplayComment: boolean;

  formValues: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private service: MccrRegistriesService) {

    this.id = this.route.snapshot.paramMap.get('id');
    this.title = "Add a new review for this mccr registry";
    this.nextRoute = `mccr/registries`;
    this.formData = new FormData();
    this.formSubmitRoute = `/v1/mccr/${this.id}`;
    this.statusses = [];


    this.mccrRegistryObservable = this.service.getMccrRegistry(this.id)
      .pipe(finalize(() => { this.isLoading = false; }));
    this.mccrRegistryObservable.subscribe((response: MccrRegistry) => {
      this.mccrRegistry = response;
      console.log(this.mccrRegistry.next_state.states);
      this.statusses = this.mccrRegistry.next_state.states;
      this.shouldDisplayComment = this.mccrRegistry.next_state.required_comments;
    });
  }

  ngOnInit() {
  }

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user', String(this.authenticationService.credentials.id));
  }

}
