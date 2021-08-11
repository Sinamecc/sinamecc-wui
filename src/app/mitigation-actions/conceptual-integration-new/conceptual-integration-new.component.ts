import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { I18nService } from '@app/i18n';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-conceptual-integration-new',
  templateUrl: './conceptual-integration-new.component.html',
  styleUrls: ['./conceptual-integration-new.component.scss'],
})
export class ConceptualIntegrationNewComponent implements OnInit {
  version: string = environment.version;

  id: string;
  mitigationAction: MitigationAction;
  mitigationActionObservable: Observable<MitigationAction>;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: MitigationActionsService,
    private i18nService: I18nService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'Conceptual Proposal Integration';
    this.nextRoute = 'mitigation/actions';
    this.formData = new FormData();
    this.formSubmitRoute = '/v1/mitigations/step/conceptual_proposal';

    this.mitigationActionObservable = this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => {
          this.mitigationAction = mitigationAction;
        })
      );
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('mitigation', context.entityCtrl);
    this.formData.append('name', 'conceptual_proposal');
    this.formData.append('entry_name', context.commentCtrl);
    this.formData.append('step_status', 'approved');
    const fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }
}
