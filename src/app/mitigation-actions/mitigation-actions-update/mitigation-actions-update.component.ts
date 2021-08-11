import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {
  GeographicScale,
  IngeiCompliance,
  MitigationActionNewFormData,
  FinanceSourceType,
} from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-actions-update',
  templateUrl: './mitigation-actions-update.component.html',
  styleUrls: ['./mitigation-actions-update.component.scss'],
})
export class MitigationActionsUpdateComponent implements OnInit {
  version: string = environment.version;
  error: string;
  formGroup: FormGroup;
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
    private route: ActivatedRoute,
    private service: MitigationActionsService
  ) {
    this.title = 'Update mitigation action';
    this.isLinear = true;
    this.action = 'update';
    this.id = this.route.snapshot.paramMap.get('id');
    this.mitigationAction$ = this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0]).pipe(
      tap((mitigationAction: MitigationAction) => {
        this.processedMitigationAction = mitigationAction;
        this.service.updateCurrentMitigationAction(mitigationAction);
      })
    );
  }

  ngOnInit(): void {}

  activateInsured(id: number): void {
    this.displayFinancialSource = id !== 1;
  }

  private initialFormData(): Observable<MitigationActionNewFormData> {
    return this.service.newMitigationActionFormData(this.i18nService.language.split('-')[0], 'new').pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  financialSourceInputShown($event: any) {
    // todo: when we translate in the backend we need to translate this hardcoded value here
    const insuredSourceTypeId = this.financeSourceTypes
      .filter((financeSource) => financeSource.name === 'Asegurado')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }
}
