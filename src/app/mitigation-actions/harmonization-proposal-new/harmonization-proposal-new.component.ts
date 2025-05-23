import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '@env/environment';
import { tap } from 'rxjs/operators';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { Observable } from 'rxjs';

import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { I18nService } from '@app/i18n';
@Component({
  selector: 'app-harmonization-proposal-new',
  templateUrl: './harmonization-proposal-new.component.html',
  styleUrls: ['./harmonization-proposal-new.component.scss'],
  standalone: false,
})
export class HarmonizationProposalNewComponent implements OnInit {
  version: string = environment.version;

  id: string;
  mitigationAction: MitigationAction;
  mitigationActionObservable: Observable<MitigationAction>;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;

  constructor(
    private route: ActivatedRoute,
    private service: MitigationActionsService,
    private i18nService: I18nService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'Harmonization Proposal Integration';
    this.nextRoute = `mitigation/actions`;
    this.formData = new FormData();
    this.formSubmitRoute = '/v1/mitigations/step/harmonization_ingei/';

    this.mitigationActionObservable = this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => {
          this.mitigationAction = mitigationAction;
        }),
      );
  }
  ngOnInit() {}

  onSubmission(context: any) {
    this.formData.append('mitigation', context.entityCtrl);
    this.formData.append('name', 'harmonization_ingei');
    this.formData.append('entry_name', context.commentCtrl);
    this.formData.append('step_status', 'approved');
    //formData.append('file', context.commentCtrl);
    const fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }
}
