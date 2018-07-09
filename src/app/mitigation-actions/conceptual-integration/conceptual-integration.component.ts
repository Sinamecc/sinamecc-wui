import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');


import { MitigationActionsService } from './../mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';


@Component({
  selector: 'app-conceptual-integration',
  templateUrl: './conceptual-integration.component.html',
  styleUrls: ['./conceptual-integration.component.scss']
})
export class ConceptualIntegrationComponent implements OnInit {

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

    dashboard() {
      this.router.navigate([`mitigation/actions`], { replaceUrl: true });
    }

}
