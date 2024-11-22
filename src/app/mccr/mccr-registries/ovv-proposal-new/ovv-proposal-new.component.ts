import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { I18nService } from '@app/i18n';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ovv-proposal-new',
  templateUrl: './ovv-proposal-new.component.html',
  styleUrls: ['./ovv-proposal-new.component.scss'],
})
export class OvvProposalNewComponent implements OnInit {
  version: string = environment.version;

  id: string;
  mccrRegistry: MccrRegistry;
  mccrRegistryObservable: Observable<MccrRegistry>;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: MccrRegistriesService,
    private i18nService: I18nService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'Formulario detalle solicitud MCCR';
    this.nextRoute = 'mccr/registries';
    this.formData = new FormData();
    this.formSubmitRoute = '/v1/mccr/step/conceptual_proposal';

    this.mccrRegistryObservable = this.service.getMccrRegistry(this.id).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    );
    this.mccrRegistryObservable.subscribe((response: MccrRegistry) => {
      this.mccrRegistry = response;
    });
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('mccr', context.entityCtrl);
    this.formData.append('name', 'ovv_proposal');
    this.formData.append('entry_name', context.commentCtrl);
    this.formData.append('step_status', 'approved');
    const fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }
}
