import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '@env/environment';
import { tap, finalize } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';

import { I18nService } from '@app/core';
import { MccrRegistry } from '../mccr-registry';
import { MccrRegistriesService } from '../mccr-registries.service';

@Component({
  selector: 'app-monitoring-proposal-verification-new',
  templateUrl: './monitoring-proposal-verification-new.component.html',
  styleUrls: ['./monitoring-proposal-verification-new.component.scss']
})
export class MonitoringProposalVerificationNewComponent implements OnInit {

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
    this.title = "Informe de Verificacion del Reporte de Monitoreo";
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
    this.formData.append('name', 'ovv_evaluation_monitoring');
    this.formData.append('entry_name', context.commentCtrl);
    this.formData.append('step_status', 'approved');
    let fileList = context.fileCtrl.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData.append('file', file, file.name);
    }
  }


}
