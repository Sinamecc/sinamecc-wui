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
		this.service.currentLevelId.subscribe(levelId => (this.levelId = levelId));
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

		console.log(this.formGroup.controls.formArray["controls"]);
		/*
		const context = {
			context: this.formGroup.value,
			gasReportTable: this.table.buildTableSection(),
			categoryTable: this.table.buildCategoryTableSection()
		};

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
      */
	}

	private createForm() {
		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					nameCtrl: ["", Validators.required],
					representativeNameCtrl: ["", Validators.required],
					telephoneCtrl: [
						"",
						Validators.compose([Validators.required, Validators.minLength(8)])
					],
					confidentialCtrl: ["", Validators.required],
					confidentialValueCtrl: [""],
					faxCtrl: "",
					postalCodeCtrl: "",
					addressCtrl: ["", Validators.required],
					legalIdCtrl: ["", Validators.required],
					emailCtrl: ["", Validators.email],
					legalRepresentativeIdCtrl: ["", Validators.required],
					ciuuListCodeCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					contactNameCtrl: ["", Validators.required],
					positionCtrl: ["", Validators.required],
					emailFormCtrl: ["", Validators.email],
					phoneCtrl: [
						"",
						Validators.compose([Validators.required, Validators.minLength(8)])
					]
				}),
				this.formBuilder.group({
					requiredCtrl: ["", Validators.required],
					amountOfEmissions:
						this.levelId === "2" ? ["", Validators.required] : null,
					amountInventoryData:
						this.levelId === "2" ? ["", Validators.required] : null,
					numberofDacilities:
						this.levelId === "2" ? ["", Validators.required] : null,
					recognitionCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					reductions: this.formBuilder.array([this.createReductionForm()])
				}),
				this.formBuilder.group({
					compensations: this.formBuilder.array([this.createcompensationForm()])
				}),
				this.formBuilder.group({
					baseYearCtrl: ["", Validators.required],
					reportYearCtrl: ["", Validators.required],
					ovvCtrl: ["", Validators.required],
					implementationEmissionDateCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					costRemovalInventoryCtrl: ["", Validators.required],
					costRemovalInventoryValueCtrl: ["CRC", Validators.required],
					removalProjectDetailCtrl: ["", Validators.required],
					totalremovalsCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					activities: this.formBuilder.array([this.createActivityForm()])
				})
			])
		});

		console.log(
			this.formGroup.controls.formArray["controls"][4].controls["compensations"]
				.controls
		);
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

	showRecognitionFormSection(elementsToShow: number[]) {
		return elementsToShow.indexOf(this.reductionFormVar) >= 0;
	}

	changeReductionCurrencyValues(value: number, index: number, field: string) {
		this.formGroup.controls.formArray["controls"][3].value.reductions[index][
			field
		] = value;
		console.log(
			this.formGroup.controls.formArray["controls"][3].value.reductions
		);
	}

	changeCompensationCurrencyValues(
		value: number,
		index: number,
		field: string
	) {
		this.formGroup.controls.formArray["controls"][4].value.compensations[index][
			field
		] = value;
		console.log(value, index, field);
		console.log(
			this.formGroup.controls.formArray["controls"][4].value.compensations
		);
	}

	createReductionForm(): FormGroup {
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

	createcompensationForm(): FormGroup {
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

	createActivityForm(): FormGroup {
		return this.formBuilder.group({
			activityCtrl: ["", Validators.required],
			sectorCtrl: ["", Validators.required],
			subSectorCtrl: ["", Validators.required]
		});
	}

	addItems(): void {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][6].controls["activities"]
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

	deleteItems(i: number): void {
		const control = <FormArray>(
			this.formGroup.controls.formArray["controls"][6].controls["activities"]
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
