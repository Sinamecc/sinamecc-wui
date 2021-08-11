import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { InitiativeFormComponent } from '@app/mitigation-actions/initiative-form/initiative-form.component';
import { BasicInformationFormComponent } from '@app/mitigation-actions/basic-information-form/basic-information-form.component';
import { KeyAspectsFormComponent } from '@app/mitigation-actions/key-aspects-form/key-aspects-form.component';
import { EmissionsMitigationFormComponent } from '@app/mitigation-actions/emissions-mitigation-form/emissions-mitigation-form.component';
import { ImpactFormComponent } from '@app/mitigation-actions/impact-form/impact-form.component';
import { Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { IngeiCompliance } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { GeographicScale } from '@app/mitigation-actions/mitigation-action-new-form-data';
import {
  MitigationActionNewFormData,
  FinanceSourceType,
} from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Observable } from 'rxjs';
import { I18nService } from '@app/i18n';

@Component({
  selector: 'app-mitigation-action-form-flow',
  templateUrl: './mitigation-action-form-flow.component.html',
  styleUrls: ['./mitigation-action-form-flow.component.scss'],
})
export class MitigationActionFormFlowComponent implements OnInit, AfterViewInit {
  @ViewChild(InitiativeFormComponent, { static: true }) initiativeForm: InitiativeFormComponent;
  @ViewChild(BasicInformationFormComponent, { static: true })
  basicInfoForm: BasicInformationFormComponent;
  @ViewChild(KeyAspectsFormComponent, { static: true }) keyAspectsForm: KeyAspectsFormComponent;
  @ViewChild(EmissionsMitigationFormComponent, { static: true })
  emissionsMitigationForm: EmissionsMitigationFormComponent;
  @ViewChild(ImpactFormComponent, { static: true }) impactForm: ImpactFormComponent;
  @Input() title: string;
  @Input() action: string;

  mainGroup: FormGroup;
  formData: FormData;
  isLoading: boolean;
  isUpdating: boolean;
  isLinear: boolean;

  id: string;
  institutions: Institution[];
  ingeis: IngeiCompliance[];
  statusses: Status[];
  geographicScales: GeographicScale[];
  financeSourceTypes: FinanceSourceType[];
  registrationTypeId: string;

  newFormData: Observable<MitigationActionNewFormData>;
  processedNewFormData: MitigationActionNewFormData;

  get formArray(): AbstractControl | null {
    return this.mainGroup.get('formArray');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private service: MitigationActionsService,
    private i18nService: I18nService,
    private cdRef: ChangeDetectorRef
  ) {
    this.formData = new FormData();
    this.isLoading = true;
    this.createForm();
  }

  ngOnInit(): void {
    this.newFormData = this.initFormOptions().pipe(
      tap((processedNewFormData: MitigationActionNewFormData) => {
        console.log('PROCESSED NEW FORM DATA', processedNewFormData);
        this.processedNewFormData = processedNewFormData;
      })
    );
    this.isUpdating = this.action === 'update';
    this.isLinear = !this.isUpdating;
    this.isLoading = false;
  }

  createForm() {
    this.mainGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this.initiativeFrm,
        this.basicInformationFrm,
        this.keyAspectsFrm,
        this.emissionsMitigationFrm,
        this.impactFrm,
      ]),
    });
  }

  private initialFormData(): Observable<MitigationActionNewFormData> {
    return this.service.newMitigationActionFormData(this.i18nService.language.split('-')[0], this.action).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  private initFormOptions(): Observable<MitigationActionNewFormData> {
    const initialRequiredData = this.initialFormData().pipe(
      tap((mitigationActionNewFormData) => {
        this.isLoading = false;
        this.registrationTypeId = mitigationActionNewFormData.registration_types[0].id;
        this.institutions = mitigationActionNewFormData.institutions;
        this.statusses = mitigationActionNewFormData.statuses;
        this.ingeis = mitigationActionNewFormData.ingei_compliances;
        this.geographicScales = mitigationActionNewFormData.geographic_scales;
        this.financeSourceTypes = mitigationActionNewFormData.finance_source_types;
      })
    );
    return initialRequiredData;
  }

  get initiativeFrm() {
    return this.initiativeForm ? this.initiativeForm.form : null;
  }

  get basicInformationFrm() {
    return this.basicInfoForm ? this.basicInfoForm.form : null;
  }

  get keyAspectsFrm() {
    return this.keyAspectsForm ? this.keyAspectsForm.form : null;
  }

  get emissionsMitigationFrm() {
    return this.emissionsMitigationForm ? this.emissionsMitigationForm.form : null;
  }

  get impactFrm() {
    return this.impactForm ? this.impactForm.form : null;
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    setTimeout(() => this.createForm(), 0);
  }
}
