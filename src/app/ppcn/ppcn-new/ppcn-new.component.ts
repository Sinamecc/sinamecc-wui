import { Component, OnInit, ElementRef, ViewChild, Input, DoCheck } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { PpcnNewFormData, RecognitionType, RequiredLevel } from '@app/ppcn/ppcn-new-form-data';
import { Sector } from '@app/ppcn/interfaces/sector';
import { SubSector } from '@app/ppcn/interfaces/subSector';
import { Ovv } from '@app/ppcn/interfaces/ovv';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GasReportTableComponent } from '@app/ppcn/gas-report-table/gas-report-table.component';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');
@Component({
  selector: 'app-ppcn-new',
  templateUrl: './ppcn-new.component.html',
  styleUrls: ['./ppcn-new.component.scss'],
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
  levelId = '1';
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
  @ViewChild('table') table: GasReportTableComponent;
  confidential: any;
  startDate: any;
  activityFormGroup: any;

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.service.currentLevelId.subscribe((levelId) => (this.levelId = levelId));
  }

  ngDoCheck() {
    if (this.levelId !== this.levelIdTmp && this.levelId !== '') {
      this.createForm();
      this.levelIdTmp = this.levelId;
    }
  }

  convertStringToNumber(value: string): Number {
    return Number(value);
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

    if ((value || '').trim()) {
      this.CIUUCodeList.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  submitForm() {
    this.isLoading = true;

    this.formGroup.controls.formArray['controls'][0].patchValue({
      ciuuListCodeCtrl: this.CIUUCodeList,
    });

    const context = {
      context: this.formGroup.value,
      gasReportTable: this.table.buildTableSection(),
      categoryTable: this.table.buildCategoryTableSection(),
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
        (response) => {
          this.router.navigate([`/ppcn/${response.id}/download/${response.geographic}`], { replaceUrl: true });
        },
        (error) => {
          log.debug(`New PPCN Form error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: ['', Validators.required],
          representativeNameCtrl: ['', Validators.required],
          telephoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
          confidentialCtrl: ['', Validators.required],
          confidentialValueCtrl: [''],
          faxCtrl: '',
          postalCodeCtrl: '',
          addressCtrl: ['', Validators.required],
          legalIdCtrl: ['', Validators.required],
          emailCtrl: ['', Validators.email],
          legalRepresentativeIdCtrl: ['', Validators.required],
          ciuuListCodeCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
        this.formBuilder.group({
          requiredCtrl: ['', Validators.required],
          amountOfEmissions: this.levelId === '2' ? ['', Validators.required] : null,
          amountInventoryData: this.levelId === '2' ? ['', Validators.required] : null,
          numberofDacilities: this.levelId === '2' ? ['', Validators.required] : null,
          recognitionCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          reductionProjectCtrl: ['', Validators.required],
          reductionActivityCtrl: ['', Validators.required],
          reductionDetailsCtrl: ['', Validators.required],
          reducedEmissionsCtrl: ['', Validators.required],
          investmentReductions: ['', Validators.required],
          investmentReductionsValue: ['', Validators.required],
          totalInvestmentReduction: ['', Validators.required],
          totalInvestmentReductionValue: ['', Validators.required],
          totalEmisionesReducidas: ['', Validators.required],
        }),
        this.formBuilder.group({
          compensationScheme: ['', Validators.required],
          projectLocation: ['', Validators.required],
          certificateNumber: ['', Validators.required],
          totalCompensation: ['', Validators.required],
          compensationCost: ['', Validators.required],
          compensationCostValue: ['', Validators.required],
          period: ['', Validators.required],
          totalEmissionsOffsets: ['', Validators.required],
          totalCostCompensation: ['', Validators.required],
        }),
        this.formBuilder.group({
          baseYearCtrl: ['', Validators.required],
          reportYearCtrl: ['', Validators.required],
          ovvCtrl: ['', Validators.required],
          implementationEmissionDateCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          costRemovalInventoryCtrl: ['', Validators.required],
          costRemovalInventoryValueCtrl: ['CRC', Validators.required],
          removalProjectDetailCtrl: ['', Validators.required],
          totalremovalsCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          activities: this.formBuilder.array([this.createActivityForm()]),
        }),
      ]),
    });

    this.formGroup.controls.formArray['controls'][3].patchValue({
      investmentReductions: 'CRC',
      totalInvestmentReduction: 'CRC',
    });

    this.formGroup.controls.formArray['controls'][4].patchValue({
      totalCostCompensation: 'CRC',
      compensationCost: 'CRC',
    });

    const subsectors = this.service.subsectors('1', this.i18nService.language.split('-')[0]);
    const initialFormData = this.initialFormData();
    this.values$ = forkJoin([subsectors, initialFormData]).subscribe((results) => {
      this.isLoading = false;
      this.subSectors = results[0];
      this.sectors = results[1].sector;
      this.required_levels = results[1].required_level;
      this.recognition_types = results[1].recognition_type;
      this.ovvs = results[1].ovv;
    });
  }

  showRecognitionFormSection(elementsToShow: number[]) {
    return elementsToShow.indexOf(this.reductionFormVar) >= 0;
  }

  createActivityForm(): FormGroup {
    return this.formBuilder.group({
      activityCtrl: ['', Validators.required],
      sectorCtrl: ['', Validators.required],
      subSectorCtrl: ['', Validators.required],
    });
  }

  addItems(): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][6].controls['activities'];
    control.push(this.createActivityForm());
  }

  deleteItems(i: number): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][4].controls['activities'];
    control.removeAt(i);
  }

  onSectorChange(newValue: any) {
    this.service
      .subsectors(String(newValue.value), this.i18nService.language.split('-')[0])
      .subscribe((subsectors: SubSector[]) => {
        this.subSectors = subsectors;
      });
  }

  private initialFormData(): Observable<PpcnNewFormData> {
    return this.service.newPpcnFormData(this.levelId, this.i18nService.language.split('-')[0]).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
}
