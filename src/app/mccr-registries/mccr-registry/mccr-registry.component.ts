import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

const log = new Logger('Report');


import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

import { MccrRegistry } from '@app/mccr-registries/mccr-registry';


@Component({
  selector: 'app-mccr-registry',
  templateUrl: './mccr-registry.component.html',
  styleUrls: ['./mccr-registry.component.scss']
})
export class MccrRegistryComponent implements OnInit {

  mccrRegistry: MccrRegistry;
  isLoading: boolean;
  id: string;
  mediaUrl: string = environment.mediaUrl;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
    this.isLoading = true;
    this.service.getMccrRegistry(this.id)
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MccrRegistry) => { this.mccrRegistry = response; }); 
  }

}
