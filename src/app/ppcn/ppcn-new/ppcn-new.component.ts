import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Input,
	DoCheck,
	AfterViewInit,
	OnChanges,
	SimpleChanges,
	SimpleChange
} from "@angular/core";
import { Router } from "@angular/router";
import {
	AbstractControl,
	FormGroup,
	FormBuilder,
	Validators,
	FormArray,
	ValidationErrors
} from "@angular/forms";
import { finalize, tap } from "rxjs/operators";
import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { PpcnService } from "@app/ppcn/ppcn.service";
import { Observable } from "rxjs/Observable";
import {
	PpcnNewFormData,
	RequiredLevel,
	RecognitionType
} from "app/ppcn/ppcn-new-form-data";
import { forkJoin } from "rxjs/observable/forkJoin";
import { MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Ppcn } from "../ppcn_registry";
import { Sector } from "../interfaces/sector";
import { SubSector } from "../interfaces/subSector";
import { Ovv } from "../interfaces/ovv";
import { GasReportTableComponent } from "../gas-report-table/gas-report-table.component";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";

const log = new Logger("Report");
@Component({
	selector: "app-ppcn-new",
	templateUrl: "./ppcn-new.component.html",
	styleUrls: ["./ppcn-new.component.scss"]
})
export class PpcnNewComponent implements OnInit, DoCheck {
	@Input() dataShared = false;

	version: string = environment.version;
	error: string;
	formGroup: FormGroup;
	ppcn: Observable<Ppcn[]>;
	processedPpcn: Ppcn[] = [];
	initialRequiredData: Observable<PpcnNewFormData>;
	isLoading = false;
	levelId = "1";
	levelIdTmp: string = this.levelId;
	activitiesList: FormArray;

	required_levels: RequiredLevel[];
	recognition_types: RecognitionType[];
	sectors: Sector[];
	subSectors: SubSector[];
	ovvs: Ovv[];

	CIUUCodeList: string[] = [];
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];

	reductionFormVar = 0;

	compensationSchemeValues = ["CER", "VER", "UCC"];

	@Input() editForm = false;
	@Input() idPpcnEdit: string;
	ppcnEdit: any;

	values$: any;
	@ViewChild("table") table: GasReportTableComponent;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	get formArray(): AbstractControl | null {
		return this.formGroup.get("formArray");
	}

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private service: PpcnService
	) {
		this.createForm();
	}

	ngOnInit() {
		this.service.currentLevelId.subscribe(
			levelId => (this.levelId = levelId.toString())
		);
		if (this.editForm) {
			this.getEditPpcn(this.idPpcnEdit);
		}
	}

	getEditPpcn(id: string) {
		this.service
			.getPpcn(id, this.i18nService.language.split("-")[0])
			.subscribe((response: Ppcn) => {
				console.log(response.organization.contact.id);
				this.ppcnEdit = response;
				this.addCIUUCodes(this.ppcnEdit.organization.ciiu_code);
				this.levelId = this.ppcnEdit.geographic_level.id.toString();
				this.reductionFormVar = +response.organization_classification
					.recognition_type.id;
				this.createForm();
			});
	}

	ngDoCheck() {
		if (this.levelId !== this.levelIdTmp && this.levelId !== "") {
			this.createForm();
			this.levelIdTmp = this.levelId;
		}
	}

	removeCIUUCode(code: string): void {
		const index = this.CIUUCodeList.indexOf(code);

		if (index >= 0) {
			this.CIUUCodeList.splice(index, 1);
		}
	}

	addCIUUCodes(codes: Object[]) {
		for (const code of codes) {
			this.CIUUCodeList.push(code["ciiu_code"]);
		}
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		if ((value || "").trim()) {
			this.CIUUCodeList.push(value.trim());
		}

		if (input) {
			input.value = "";
		}
	}

	submitForm() {
		this.isLoading = true;

		this.formGroup.controls.formArray["controls"][0].patchValue({
			ciuuListCodeCtrl: this.CIUUCodeList
		});

		const context = {
			context: this.formGroup.value,
			gasReportTable:
				this.levelId === "2" ? this.table.buildTableSection() : null,
			categoryTable:
				this.levelId === "2" ? this.table.buildCategoryTableSection() : null
		};

		if (this.editForm) {
			this.submitEditForm(context);
		} else {
			this.submitCreateForm(context);
		}
	}

	submitEditForm(context: any) {
		this.service
			.submitUpdatePpcnForm(
				context,
				this.ppcnEdit.id,
				this.ppcnEdit.organization.contact.id,
				+this.levelId,
				this.ppcnEdit.gei_organization.id
			)
			.pipe(
				finalize(() => {
					this.formGroup.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				response => {
					//this.router.navigate(
					//	[`/ppcn/${response.id}/download/${response.geographic}`],
					//	{ replaceUrl: true }
					//);
					console.log("it works");
				},
				error => {
					log.debug(`New PPCN Form error: ${error}`);
					this.errorComponent.parseErrors(error);
					this.error = error;
				}
			);
	}

	submitCreateForm(context: any) {
		this.service
			.submitNewPpcnForm(context)
			.pipe(
				finalize(() => {
					this.formGroup.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				response => {
					this.router.navigate(
						[`/ppcn/${response.id}/download/${response.geographic}`],
						{ replaceUrl: true }
					);
				},
				error => {
					log.debug(`New PPCN Form error: ${error}`);
					this.errorComponent.parseErrors(error);
					this.error = error;
				}
			);
	}

	filterValue(value: string) {
		return value == null ? "" : value;
	}

	private createForm() {
		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					nameCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.name)
							: "",
						Validators.required
					],
					representativeNameCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.representative_name)
							: "",
						Validators.required
					],
					telephoneCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.phone_organization)
							: "",
						Validators.compose([Validators.required, Validators.minLength(8)])
					],
					confidentialCtrl: ["si", Validators.required],
					confidentialValueCtrl: [""],
					faxCtrl:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(this.ppcnEdit.organization.fax)
										: "",
									Validators.required
							  ]
							: null,
					postalCodeCtrl: this.editForm
						? this.filterValue(this.ppcnEdit.organization.postal_code)
						: "",
					addressCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.address)
							: "",
						Validators.required
					],
					legalIdCtrl:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(
												this.ppcnEdit.organization.legal_identification
										  )
										: "",
									Validators.required
							  ]
							: null,

					emailCtrl: this.levelId === "1" ? ["", Validators.required] : null,
					legalRepresentativeIdCtrl: [
						this.editForm
							? this.filterValue(
									this.ppcnEdit.organization.representative_legal_identification
							  )
							: "",
						Validators.required
					],
					ciuuListCodeCtrl:
						this.levelId === "2"
							? [this.editForm ? " " : "", Validators.required]
							: null
				}),
				this.formBuilder.group({
					contactNameCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.contact.full_name)
							: "",
						Validators.required
					],
					positionCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.contact.job_title)
							: "",
						Validators.required
					],
					emailFormCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.contact.email)
							: "",
						Validators.email
					],
					phoneCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.organization.contact.phone)
							: "",
						Validators.compose([Validators.required, Validators.minLength(8)])
					]
				}),
				this.formBuilder.group({
					requiredCtrl: [
						this.editForm
							? this.filterValue(
									this.ppcnEdit.organization_classification.required_level.id
							  )
							: "",
						Validators.required
					],

					amountOfEmissions:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(
												this.ppcnEdit.organization_classification
													.emission_quantity
										  )
										: "",
									Validators.required
							  ]
							: null,
					amountInventoryData:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(
												this.ppcnEdit.organization_classification
													.data_inventory_quantity
										  )
										: "",
									Validators.required
							  ]
							: null,
					numberofDacilities:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(
												this.ppcnEdit.organization_classification
													.buildings_number
										  )
										: "",
									Validators.required
							  ]
							: null,
					complexityMethodologies:
						this.levelId === "2" ? ["1", Validators.required] : null,
					recognitionCtrl: [
						this.editForm
							? this.filterValue(
									this.ppcnEdit.organization_classification.recognition_type.id
							  )
							: "",
						Validators.required
					]
				}),
				this.formBuilder.group({
					reductions: this.editForm
						? this.createReductionForm()
						: this.formBuilder.array([this.createReductionForm()])
				}),
				this.formBuilder.group({
					compensations: this.editForm
						? this.createcompensationForm()
						: this.formBuilder.array([this.createcompensationForm()])
				}),
				this.formBuilder.group({
					baseYearCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.gei_organization.base_year)
							: "",
						Validators.required
					],
					reportYearCtrl: [
						this.editForm
							? this.filterValue(this.ppcnEdit.gei_organization.report_year)
							: "",
						Validators.required
					],
					ovvCtrl:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(this.ppcnEdit.gei_organization.ovv.id)
										: "",
									Validators.required
							  ]
							: null,
					implementationEmissionDateCtrl:
						this.levelId === "2"
							? [
									this.editForm
										? this.filterValue(
												this.ppcnEdit.gei_organization.emission_ovv_date
										  )
										: "",
									Validators.required
							  ]
							: null,
					scope: ["", Validators.required]
				}),
				this.formBuilder.group({
					removals: this.editForm
						? this.createRemovalForm()
						: this.formBuilder.array([this.createRemovalForm()])
				}),
				this.formBuilder.group({
					activities: this.formBuilder.array([this.createActivityForm()])
				})
			])
		});

		if (!this.editForm) {
			const subsectors = this.service.subsectors(
				"1",
				this.i18nService.language.split("-")[0]
			);
			const initialFormData = this.initialFormData();
			this.values$ = forkJoin([subsectors, initialFormData]).subscribe(
				results => {
					this.isLoading = false;
					this.subSectors = results[0];
					this.sectors = results[1].sector;
					this.required_levels = results[1].required_level;
					this.recognition_types = results[1].recognition_type;
					this.ovvs = results[1].ovv;
				}
			);
		}
	}

	showRecognitionFormSection(elementsToShow: number[]) {
		return elementsToShow.indexOf(this.reductionFormVar) >= 0;
	}

	changeReductionCurrencyValues(value: number, index: number, field: string) {
		this.formGroup.controls.formArray["controls"][3].value.reductions[index][
			field
		] = value;
	}

	changeCompensationCurrencyValues(
		value: number,
		index: number,
		field: string
	) {
		this.formGroup.controls.formArray["controls"][4].value.compensations[index][
			field
		] = value;
	}

	createReductionForm(): FormGroup | FormArray {
		if (this.editForm) {
			const reductions: FormGroup[] = [];
			for (const reduction of this.ppcnEdit.organization_classification
				.reduction) {
				const form = this.formBuilder.group({
					reductionProjectCtrl: [reduction.project, Validators.required],
					reductionActivityCtrl: [reduction.activity, Validators.required],
					reductionDetailsCtrl: [
						reduction.detail_reduction,
						Validators.required
					],
					reducedEmissionsCtrl: [reduction.emission, Validators.required],
					investmentReductions: [
						reduction.investment_currency,
						Validators.required
					],
					investmentReductionsValue: [
						reduction.investment,
						Validators.required
					],
					totalInvestmentReduction: [
						reduction.total_investment_currency,
						Validators.required
					],
					totalInvestmentReductionValue: [
						reduction.total_investment,
						Validators.required
					],
					totalEmisionesReducidas: [
						reduction.total_emission,
						Validators.required
					]
				});
				reductions.push(form);
			}
			return this.formBuilder.array(reductions);
		} else {
			return this.formBuilder.group({
				reductionProjectCtrl: ["", Validators.required],
				reductionActivityCtrl: ["", Validators.required],
				reductionDetailsCtrl: ["", Validators.required],
				reducedEmissionsCtrl: ["", Validators.required],
				investmentReductions: ["CRC", Validators.required],
				investmentReductionsValue: ["", Validators.required],
				totalInvestmentReduction: ["CRC", Validators.required],
				totalInvestmentReductionValue: ["", Validators.required],
				totalEmisionesReducidas: ["", Validators.required]
			});
		}
	}

	createcompensationForm(): FormGroup | FormArray {
		if (this.editForm) {
			const compensations: FormGroup[] = [];
			for (const compensation of this.ppcnEdit.organization_classification
				.carbon_offset) {
				const form = this.formBuilder.group({
					compensationScheme: [compensation.offset_scheme, Validators.required],
					projectLocation: [compensation.project_location, Validators.required],
					certificateNumber: [
						compensation.certificate_identification,
						Validators.required
					],
					totalCompensation: [
						compensation.total_carbon_offset,
						Validators.required
					],
					compensationCost: [
						compensation.offset_cost_currency,
						Validators.required
					],
					compensationCostValue: [
						compensation.offset_cost,
						Validators.required
					],
					period: [compensation.period, Validators.required],
					totalEmissionsOffsets: [
						compensation.total_offset_cost,
						Validators.required
					],
					totalCostCompensation: [
						compensation.total_offset_cost_currency,
						Validators.required
					]
				});
				compensations.push(form);
			}
			return this.formBuilder.array(compensations);
		} else {
			return this.formBuilder.group({
				compensationScheme: ["", Validators.required],
				projectLocation: ["", Validators.required],
				certificateNumber: ["", Validators.required],
				totalCompensation: ["", Validators.required],
				compensationCost: ["CRC", Validators.required],
				compensationCostValue: ["", Validators.required],
				period: ["", Validators.required],
				totalEmissionsOffsets: ["", Validators.required],
				totalCostCompensation: ["CRC", Validators.required]
			});
		}
	}

	createActivityForm(): FormGroup {
		return this.formBuilder.group({
			activityCtrl: this.levelId === "2" ? ["", Validators.required] : null,
			sectorCtrl: this.levelId === "2" ? ["", Validators.required] : null,
			subSectorCtrl: this.levelId === "2" ? ["", Validators.required] : null
		});
	}

	createRemovalForm(): FormGroup | FormArray {
		if (this.editForm) {
			const removals: FormGroup[] = [];
			for (let reduction of this.ppcnEdit.gas_removal) {
				const form = this.formBuilder.group({
					costRemovalInventoryCtrl: [reduction.removal_cost],
					costRemovalInventoryValueCtrl: [reduction.removal_cost_currency],
					removalProjectDetailCtrl: [reduction.removal_descriptions],
					totalremovalsCtrl: [reduction.total]
				});
				removals.push(form);
			}
			return this.formBuilder.array(removals);
		} else {
			return this.formBuilder.group({
				costRemovalInventoryCtrl: [""],
				costRemovalInventoryValueCtrl: ["CRC"],
				removalProjectDetailCtrl: [""],
				totalremovalsCtrl: [""]
			});
		}
	}

	addItems(): void {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][7].controls["activities"]
		);
		control.push(this.createActivityForm());
	}

	addReductionItem() {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][3].controls["reductions"]
		);
		control.push(this.createReductionForm());
	}

	addCompensationItem() {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][4].controls["compensations"]
		);
		control.push(this.createcompensationForm());
	}

	addRemovalItem() {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][6].controls["removals"]
		);

		control.push(this.createRemovalForm());
	}

	deleteRemovalItem(i: number) {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][6].controls["removals"]
		);
		control.removeAt(i);
	}

	deleteItems(i: number): void {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][7].controls["activities"]
		);
		control.removeAt(i);
	}

	deleteReductionItem(index: number) {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][3].controls["reductions"]
		);
		control.removeAt(index);
	}

	deleteCompensationItem(index: number) {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][4].controls["compensations"]
		);
		control.removeAt(index);
	}

	onSectorChange(newValue: any) {
		this.service
			.subsectors(
				String(newValue.value),
				this.i18nService.language.split("-")[0]
			)
			.subscribe((subsectors: SubSector[]) => {
				this.subSectors = subsectors;
			});
	}

	private initialFormData(): Observable<PpcnNewFormData> {
		return this.service
			.newPpcnFormData(this.levelId, this.i18nService.language.split("-")[0])
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			);
	}
}
