import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  MitigationActionNewFormData,
  FinanceSourceType,
} from '@app/mitigation-actions/mitigation-action-new-form-data';
import { IngeiCompliance, Institution, Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { GeographicScale } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { Router } from '@angular/router';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';

@Component({
  selector: 'app-mitigation-actions-new',
  templateUrl: './mitigation-actions-new.component.html',
  styleUrls: ['./mitigation-actions-new.component.scss'],
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

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService
  ) {
    this.action = 'new';
    this.isLinear = true;
  }

  ngOnInit(): void {}

  activateInsured(id: number): void {
    this.displayFinancialSource = id !== 1;
  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.financeSourceTypes
      .filter((financeSource) => financeSource.name === 'Asegurado')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }
}
