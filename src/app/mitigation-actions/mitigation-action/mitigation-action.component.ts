import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-action',
  templateUrl: './mitigation-action.component.html',
  styleUrls: ['./mitigation-action.component.scss'],
})
export class MitigationActionComponent implements OnInit {
  mitigationAction: MitigationAction;
  isLoading: boolean;
  id: string;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: MitigationAction) => {
        this.mitigationAction = response;
      });
  }

  review(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], { replaceUrl: true });
  }

  async download(file: string) {
    this.isLoading = true;
    const blob = await this.service.downloadResource(file);
    const url = window.URL.createObjectURL(blob.data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = blob.filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.isLoading = false;
  }
}
