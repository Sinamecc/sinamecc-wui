import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');


import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';



@Component({
  selector: 'app-mitigation-action',
  templateUrl: './mitigation-action.component.html',
  styleUrls: ['./mitigation-action.component.scss']
})
export class MitigationActionComponent implements OnInit {

  mitigationAction: MitigationAction;
  isLoading: boolean;
  id: string;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
    this.isLoading = true;
    this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MitigationAction) => { this.mitigationAction = response; }); 
  }


  review(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], { replaceUrl: true });
  }

  async download(file:string) {
    this.isLoading = true;
    const blob = await this.service.downloadResource(file);
    console.log('start download:',blob);
    var url = window.URL.createObjectURL(blob.data);
    var a = document.createElement('a');
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
