import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

const log = new Logger('Report');


import { MitigationActionsService } from './../mitigation-actions.service';
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
    this.service.getMitigationAction(this.id)
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MitigationAction) => { this.mitigationAction = response; }); 
  }


  review(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/reviews`], { replaceUrl: true });
  }

}
