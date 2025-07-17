import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import {
  MitigationActionNewFormData,
  FinanceSourceType,
} from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { IngeiCompliance } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { GeographicScale } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Logger } from '@core';
import { Observable } from 'rxjs';
import { MitigationAction } from '../mitigation-action';
import { I18nService } from '@app/i18n';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-actions-update',
  templateUrl: './mitigation-actions-update.component.html',
  styleUrls: ['./mitigation-actions-update.component.scss'],
  standalone: false,
})
export class MitigationActionsUpdateComponent implements OnInit {
  version: string = environment.version;
  error: string;
  formGroup: UntypedFormGroup;
  isLoading = false;
  isNonLinear = false;
  initalRequiredData: Observable<MitigationActionNewFormData>;
  title: string;
  isLinear: boolean;
  action: string;

  id: string;

  processedMitigationAction: MitigationAction;
  mitigationAction$: Observable<MitigationAction>;

  startDate = new Date(1990, 0, 1);
  institutions: Institution[];
  ingeis: IngeiCompliance[];
  statuses: Status[];
  geographicScales: GeographicScale[];
  financeSourceTypes: FinanceSourceType[];
  displayFinancialSource: boolean;

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  constructor(
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private service: MitigationActionsService,
  ) {
    this.title = 'Update mitigation action';
    this.isLinear = true;
    this.action = 'update';
    this.id = this.route.snapshot.paramMap.get('id');
    this.mitigationAction$ = this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0]).pipe(
      tap((mitigationAction: MitigationAction) => {
        this.processedMitigationAction = mitigationAction;
        this.service.updateCurrentMitigationAction(mitigationAction);
      }),
    );
  }

  ngOnInit() {}

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
