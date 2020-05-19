import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData, FinanceSourceType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { IngeiCompliance } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { GeographicScale } from '@app/mitigation-actions/mitigation-action-new-form-data';

import { Observable } from 'rxjs/Observable';
import { MatSelectChange } from '@angular/material/select';

const log = new Logger('Report');


@Component({
  selector: 'app-mitigation-actions-new',
  templateUrl: './mitigation-actions-new.component.html',
  styleUrls: ['./mitigation-actions-new.component.scss']
})
export class MitigationActionsNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  formGroup: FormGroup;
  isLoading = false;
  isNonLinear = false;
  initalRequiredData: Observable<MitigationActionNewFormData>;
  title: string;
  isLinear: boolean;
  action: string;

  startDate = new Date(1990, 0, 1);
  institutions: Institution[];
  ingeis: IngeiCompliance[];
  statusses: Status[];
  geographicScales: GeographicScale[];
  financeSourceTypes: FinanceSourceType[];
  displayFinancialSource: Boolean;


  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService) {
    // this.createForm();
    this.title = 'mitigationAction.CreateMA';
    this.action = 'new';
    this.isLinear = true;
  }

  ngOnInit() { }

  activateInsured(id: number): void {
    this.displayFinancialSource = id !== 1;
  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.financeSourceTypes.
      filter(financeSource => financeSource.name === 'Asegurado').map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }

}
