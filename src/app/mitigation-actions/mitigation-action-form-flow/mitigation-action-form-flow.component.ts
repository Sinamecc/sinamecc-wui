import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	EventEmitter,
	Input,
	AfterViewInit,
	ChangeDetectorRef
} from "@angular/core";
import { Router } from "@angular/router";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
	FormControl
} from "@angular/forms";
import { finalize, map, tap } from "rxjs/operators";

import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import {
	MitigationActionNewFormData,
	FinanceSourceType,
	RegistrationType
} from "@app/mitigation-actions/mitigation-action-new-form-data";
import { Institution } from "@app/mitigation-actions/mitigation-action-new-form-data";
import { Status } from "@app/mitigation-actions/mitigation-action-new-form-data";
import { IngeiCompliance } from "@app/mitigation-actions/mitigation-action-new-form-data";
import { GeographicScale } from "@app/mitigation-actions/mitigation-action-new-form-data";

import { Observable } from "rxjs/Observable";
import { MatSelectChange } from "@angular/material/select";
import { MitigationAction } from "@app/mitigation-actions/mitigation-action";
import { InitiativeFormComponent } from "@app/mitigation-actions/initiative-form/initiative-form.component";
import { BasicInformationFormComponent } from "@app/mitigation-actions/basic-information-form/basic-information-form.component";
import { KeyAspectsFormComponent } from "@app/mitigation-actions/key-aspects-form/key-aspects-form.component";
import { EmissionsMitigationFormComponent } from "@app/mitigation-actions/emissions-mitigation-form/emissions-mitigation-form.component";
import { ImpactFormComponent } from "@app/mitigation-actions/impact-form/impact-form.component";

@Component({
	selector: "app-mitigation-action-form-flow",
	templateUrl: "./mitigation-action-form-flow.component.html",
	styleUrls: ["./mitigation-action-form-flow.component.scss"]
})
export class MitigationActionFormFlowComponent
	implements OnInit, AfterViewInit {
	@ViewChild(InitiativeFormComponent) initiativeForm: InitiativeFormComponent;
	@ViewChild(BasicInformationFormComponent)
	basicInfoForm: BasicInformationFormComponent;
	@ViewChild(KeyAspectsFormComponent) keyAspectsForm: KeyAspectsFormComponent;
	@ViewChild(EmissionsMitigationFormComponent)
	emissionsMitigationForm: EmissionsMitigationFormComponent;
	@ViewChild(ImpactFormComponent) impactForm: ImpactFormComponent;
	@Input() title: string;
	// @Input() isLinear: boolean;
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
		return this.mainGroup.get("formArray");
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

	ngOnInit() {
		this.newFormData = this.initFormOptions().pipe(
			tap((processedNewFormData: MitigationActionNewFormData) => {
				console.log("PROCESSED NEW FORM DATA", processedNewFormData);
				this.processedNewFormData = processedNewFormData;
			})
		);
		this.isUpdating = this.action === "update";
		this.isLinear = !this.isUpdating;
		this.isLoading = false;
	}

	createForm() {
		this.mainGroup = this._formBuilder.group({
			// this.formBuilder.array([])
			formArray: this._formBuilder.array([
				this.initiativeFrm,
				this.basicInformationFrm,
				this.keyAspectsFrm,
				this.emissionsMitigationFrm,
				this.impactFrm
			])
		});
	}

	private initialFormData(): Observable<MitigationActionNewFormData> {
		return this.service
			.newMitigationActionFormData(
				this.i18nService.language.split("-")[0],
				this.action
			)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			);
	}

	private initFormOptions(): Observable<MitigationActionNewFormData> {
		const initialRequiredData = this.initialFormData().pipe(
			tap(mitigationActionNewFormData => {
				this.isLoading = false;
				this.registrationTypeId =
					mitigationActionNewFormData.initiative_type[0].id;
				this.institutions = mitigationActionNewFormData.institutions;
				this.statusses = mitigationActionNewFormData.statuses;
				this.ingeis = mitigationActionNewFormData.ingei_compliances;
				this.geographicScales = mitigationActionNewFormData.geographic_scales;
				this.financeSourceTypes =
					mitigationActionNewFormData.finance_source_types;
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
		return this.emissionsMitigationForm
			? this.emissionsMitigationForm.form
			: null;
	}

	get impactFrm() {
		return this.impactForm ? this.impactForm.form : null;
	}

	ngAfterViewInit() {
		this.cdRef.detectChanges();
		setTimeout(() => this.createForm(), 0);
	}
}
