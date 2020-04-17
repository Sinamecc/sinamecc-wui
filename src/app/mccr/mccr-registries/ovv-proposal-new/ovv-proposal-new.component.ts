import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '@env/environment';
import { tap, finalize } from 'rxjs/operators';


import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { Observable } from 'rxjs/Observable';

import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { I18nService } from '@app/core';
import { MccrRegistry } from '../mccr-registry';
import { MccrRegistriesService } from '../mccr-registries.service';

@Component({
  selector: 'app-ovv-proposal-new',
  templateUrl: './ovv-proposal-new.component.html',
  styleUrls: ['./ovv-proposal-new.component.scss']
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

  // @Output() formDataEvent = new EventEmitter<any>();


  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MccrRegistriesService,
    private i18nService: I18nService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = "Formulario detalle solicitud MCCR";
    this.nextRoute = "mccr/registries";
    this.formData = new FormData();
    this.formSubmitRoute = "/v1/mccr/step/conceptual_proposal";

    
    this.mccrRegistryObservable = this.service.getMccrRegistry(this.id)
    .pipe(finalize(() => { this.isLoading = false; }));
    this.mccrRegistryObservable.subscribe((response: MccrRegistry) => { 
      this.mccrRegistry = response; 
    }); 
  }

  ngOnInit() {
  }

  onSubmission(context: any) {
    this.formData.append('mccr', context.entityCtrl);
    this.formData.append('name', 'ovv_proposal');
    this.formData.append('entry_name', context.commentCtrl);
    this.formData.append('step_status', 'approved');
    let fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }




}
