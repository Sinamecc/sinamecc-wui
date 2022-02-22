import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registries-review',
  templateUrl: './mccr-registries-review.component.html',
  styleUrls: ['./mccr-registries-review.component.scss'],
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
  statuses: string[];
  shouldDisplayComment: boolean;

  formValues: any;
  constructor(
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private service: MccrRegistriesService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'specificLabel.addReviewMCCRRegistry';
    this.nextRoute = `mccr/registries`;
    this.formData = new FormData();
    this.formSubmitRoute = `/v1/mccr/${this.id}`;
    this.statuses = [];

    this.mccrRegistryObservable = this.service.getMccrRegistry(this.id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
    this.mccrRegistryObservable.subscribe((response: MccrRegistry) => {
      this.mccrRegistry = response;
      this.statuses = this.mccrRegistry.next_state.states;
      this.shouldDisplayComment = this.mccrRegistry.next_state.required_comments;
    });
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
