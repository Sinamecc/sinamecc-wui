import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { I18nService } from '@app/i18n';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-file-version',
  templateUrl: './file-version.component.html',
  styleUrls: ['./file-version.component.scss'],
})
export class FileVersionComponent implements OnInit {
  version: string = environment.version;

  id: string;
  ppcn: Ppcn;
  ppcnObservable: Observable<Ppcn>;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PpcnService,
    private i18nService: I18nService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'File Version PPCN Registry';
    this.nextRoute = `ppcn/registries`;
    this.formData = new FormData();
    this.formSubmitRoute = '/v1/ppcn/step/label/';

    this.ppcnObservable = this.service.getPpcn(this.id, this.i18nService.language.split('-')[0]).pipe(
      tap((ppcn: Ppcn) => {
        this.ppcn = ppcn;
      })
    );
  }

  ngOnInit(): void {}

  onSubmission(context: any) {
    this.formData.append('ppcn', context.entityCtrl);
    this.formData.append('name', 'dummy - 0');
    this.formData.append('entry_name', 'entry_name');
    this.formData.append('step_status', 'Accepted');
    //formData.append('file', context.commentCtrl);
    const fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }
}
