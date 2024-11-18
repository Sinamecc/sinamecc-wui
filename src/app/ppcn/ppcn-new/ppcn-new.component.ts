import { Component, OnInit, ViewChild, Input, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  ValidationErrors,
} from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { Observable } from 'rxjs';
import { PpcnNewFormData, RequiredLevel, RecognitionType } from '@app/ppcn/ppcn-new-form-data';
import { forkJoin } from 'rxjs';
// import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Ppcn } from '../ppcn_registry';
import { Sector } from '../interfaces/sector';
import { SubSector } from '../interfaces/subSector';
import { Ovv } from '../interfaces/ovv';
import { GasReportTableComponent } from '../gas-report-table/gas-report-table.component';
import { ErrorReportingComponent } from '@shared/error-reporting/error-reporting.component';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '@app/i18n';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';

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
  formGroup: UntypedFormGroup;
  ppcn: Observable<Ppcn[]>;
  processedPpcn: Ppcn[] = [];
  initialRequiredData: Observable<PpcnNewFormData>;
  isLoading = false;
  levelId = '1';
  levelIdTmp: string = this.levelId;
  activitiesList: UntypedFormArray;

  required_levels: RequiredLevel[];
  recognition_types: RecognitionType[];
  sectors: Sector[];
  subSectors: SubSector[];
  ovvs: Ovv[];
  confidential: string;

  CIUUCodeList: string[] = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  reductionFormVar = 0;

  compensationSchemeValues = ['CER', 'VER', 'UCC'];

  @Input() editForm = false;
  @Input() idPpcnEdit: string;

  ppcnEdit: any;

  values$: any;
  @ViewChild('table') table: GasReportTableComponent;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  savedPPCN = false;
  ppcnAutoSaved: Ppcn;
  startDate: Date;

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.service.currentLevelId.subscribe((levelId) => (this.levelId = levelId.toString()));
    if (this.editForm) {
      this.getEditPpcn(this.idPpcnEdit);
    }
  }

  getEditPpcn(id: string) {
    this.service.getPpcn(id, this.i18nService.language.split('-')[0]).subscribe((response: Ppcn) => {
      this.ppcnAutoSaved = response;
      this.savedPPCN = true;

      this.ppcnEdit = response;
      this.addCIUUCodes(this.ppcnEdit.organization.ciiu_code);
      this.levelId = this.ppcnEdit.geographic_level.id.toString();
      this.reductionFormVar = response.organization_classification
        ? +response.organization_classification.recognition_type.id
        : null;
      this.createForm();
    });
  }

  ngDoCheck() {
    if (this.levelId !== this.levelIdTmp && this.levelId !== '') {
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
      this.CIUUCodeList.push(code['ciiu_code']);
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

    const contextForm = this.formGroup.value['formArray'];
    contextForm['gasReportTable'] = this.levelId === '2' ? this.table.buildTableSection() : null;
    contextForm['categoryTable'] = this.levelId === '2' ? this.table.buildCategoryTableSection() : null;

    const contactFormId: any = this.ppcnAutoSaved ? this.ppcnAutoSaved.organization.contact.id : null;
    const geiOrganizationId: any = this.ppcnAutoSaved
      ? this.ppcnAutoSaved.gei_organization
        ? this.ppcnAutoSaved.gei_organization.id
        : null
      : null;
    const geographicFormId: any = this.ppcnAutoSaved ? +this.levelId : null;
    const id: any = this.ppcnAutoSaved ? this.ppcnAutoSaved.id : null;

    const context = {
      context: contextForm,
      contactFormId: contactFormId,
      geiOrganizationId: geiOrganizationId,
      geographicFormId: geographicFormId,
      id: id,
    };

    if (this.editForm) {
      this.submitEditForm(context);
    } else {
      this.submitCreateForm(context);
    }
  }

  submitEditForm(context: any) {
    this.service
      .submitPPCN(
        7,
        context.context,
        this.savedPPCN,
        context.contactFormId,
        context.geiOrganizationId,
        context.geographicFormId,
        context.id
      )
      .pipe(
        finalize(() => {
          this.formGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/ppcn/registries'], { replaceUrl: true });
          this.translateService.get('ppcn.ppcnUpdateSuccess').subscribe((res: string) => {
            this.snackBar.open(res, `PPCN ID ${response.id} `, {
              duration: 3000,
            });
          });

          if (this.ppcnEdit.ppcn_files.length === 0) {
            this.router.navigate([`ppcn/${response.id}/upload/new`], {
              replaceUrl: true,
            });
          }
        },
        (error) => {
          log.debug(`New PPCN Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
        }
      );
  }

  saveState(state: number) {
    this.formGroup.controls.formArray['controls'][0].patchValue({
      ciuuListCodeCtrl: this.CIUUCodeList,
    });

    const context = this.formGroup.value['formArray'];
    context['gasReportTable'] = this.levelId === '2' ? this.table.buildTableSection() : null;
    context['categoryTable'] = this.levelId === '2' ? this.table.buildCategoryTableSection() : null;

    const contactFormId: any = this.ppcnAutoSaved ? this.ppcnAutoSaved.organization.contact.id : null;
    const geiOrganizationId: any = this.ppcnAutoSaved
      ? this.ppcnAutoSaved.gei_organization
        ? this.ppcnAutoSaved.gei_organization.id
        : null
      : null;
    const geographicFormId: any = this.ppcnAutoSaved ? +this.levelId : null;
    const id: any = this.ppcnAutoSaved ? this.ppcnAutoSaved.id : null;
    this.service
      .submitPPCN(state, context, this.savedPPCN, contactFormId, geiOrganizationId, geographicFormId, id)
      .subscribe(
        (response) => {
          if (!this.savedPPCN) {
            this.service
              .getPpcn(response.id, this.i18nService.language.split('-')[0])
              .subscribe((ppcnResponse: Ppcn) => {
                this.ppcnAutoSaved = ppcnResponse;
              });
            this.savedPPCN = true;
          }

          this.responseMessaage('ppcn.ppcnSave');
        },
        (error) => {
          this.responseMessaage('ppcn.ppcnSaveError');
        }
      );
  }

  responseMessaage(message: string) {
    this.translateService.get(message).subscribe((res: string) => {
      this.snackBar.open(res, null, {
        duration: 3000,
      });
    });
  }

  submitCreateForm(context: any) {
    this.service
      .submitPPCN(
        7,
        context.context,
        this.savedPPCN,
        context.contactFormId,
        context.geiOrganizationId,
        context.geographicFormId,
        context.id
      )
      .subscribe(
        (response) => {
          this.router.navigate([`ppcn/${response.id}/upload/new`], {
            replaceUrl: true,
          });
        },
        (error) => {
          log.debug(`PPCN Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
        }
      );
  }

  filterValue(value: string) {
    return value ? value : '';
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: [this.editForm ? this.filterValue(this.ppcnEdit.organization.name) : '', Validators.required],
          representativeNameCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.representative_name) : '',
            Validators.required,
          ],
          telephoneCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.phone_organization) : '',
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
          confidentialCtrl: ['si', Validators.required],
          confidentialValueCtrl: [''],
          faxCtrl:
            this.levelId === '2'
              ? [this.editForm ? this.filterValue(this.ppcnEdit.organization.fax) : '', Validators.required]
              : null,
          postalCodeCtrl: this.editForm ? this.filterValue(this.ppcnEdit.organization.postal_code) : '',
          addressCtrl: [this.editForm ? this.filterValue(this.ppcnEdit.organization.address) : '', Validators.required],
          legalIdCtrl:
            this.levelId === '2'
              ? [
                  this.editForm ? this.filterValue(this.ppcnEdit.organization.legal_identification) : '',
                  Validators.required,
                ]
              : null,

          emailCtrl:
            this.levelId === '1'
              ? [
                  this.editForm ? this.filterValue(this.ppcnEdit.organization.email_representative_legal) : '',
                  Validators.required,
                ]
              : null,
          legalRepresentativeIdCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.representative_legal_identification) : '',
            Validators.required,
          ],
          ciuuListCodeCtrl: this.levelId === '2' ? [this.editForm ? ' ' : '', Validators.required] : null,
        }),
        this.formBuilder.group({
          contactNameCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.contact.full_name) : '',
            Validators.required,
          ],
          positionCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.contact.job_title) : '',
            Validators.required,
          ],
          emailFormCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.contact.email) : '',
            Validators.email,
          ],
          phoneCtrl: [
            this.editForm ? this.filterValue(this.ppcnEdit.organization.contact.phone) : '',
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
        }),
        this.formBuilder.group({
          requiredCtrl: [
            this.editForm
              ? this.filterValue(
                  this.ppcnEdit.organization_classification
                    ? this.ppcnEdit.organization_classification.required_level.id
                    : null
                )
              : '',
            Validators.required,
          ],

          amountOfEmissions:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(
                        this.ppcnEdit.organization_classification
                          ? this.ppcnEdit.organization_classification.emission_quantity
                          : null
                      )
                    : '',
                  Validators.required,
                ]
              : null,
          amountInventoryData:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(
                        this.ppcnEdit.organization_classification
                          ? this.ppcnEdit.organization_classification.data_inventory_quantity
                          : null
                      )
                    : '',
                  Validators.required,
                ]
              : null,
          numberofDacilities:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(
                        this.ppcnEdit.organization_classification
                          ? this.ppcnEdit.organization_classification.buildings_number
                          : null
                      )
                    : '',
                  Validators.required,
                ]
              : null,
          complexityMethodologies:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(
                        this.ppcnEdit.organization_classification
                          ? this.ppcnEdit.organization_classification.methodologies_complexity
                          : null
                      )
                    : '',
                  Validators.required,
                ]
              : null,
          recognitionCtrl: [
            this.editForm
              ? this.filterValue(
                  this.ppcnEdit.organization_classification
                    ? this.ppcnEdit.organization_classification.recognition_type.id
                    : null
                )
              : '',
            Validators.required,
          ],
        }),
        this.formBuilder.group({
          reductions: this.editForm ? this.createReductionForm() : this.formBuilder.array([this.createReductionForm()]),
        }),
        this.formBuilder.group({
          compensations: this.editForm
            ? this.createcompensationForm()
            : this.formBuilder.array([this.createcompensationForm()]),
        }),
        this.formBuilder.group({
          baseYearCtrl: [
            this.editForm
              ? this.filterValue(this.ppcnEdit.gei_organization ? this.ppcnEdit.gei_organization.base_year : null)
              : '',
            Validators.required,
          ],
          reportYearCtrl: [
            this.editForm
              ? this.filterValue(this.ppcnEdit.gei_organization ? this.ppcnEdit.gei_organization.report_year : null)
              : '',
            Validators.required,
          ],
          ovvCtrl:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(this.ppcnEdit.gei_organization ? this.ppcnEdit.gei_organization.ovv.id : null)
                    : '',
                  Validators.required,
                ]
              : null,
          implementationEmissionDateCtrl:
            this.levelId === '2'
              ? [
                  this.editForm
                    ? this.filterValue(
                        this.ppcnEdit.gei_organization ? this.ppcnEdit.gei_organization.emission_ovv_date : null
                      )
                    : '',
                  Validators.required,
                ]
              : null,
          scope: [
            this.editForm
              ? this.filterValue(this.ppcnEdit.gei_organization ? this.ppcnEdit.gei_organization.scope : null)
              : '',
            Validators.required,
          ],
        }),
        this.formBuilder.group({
          removals: this.editForm ? this.createRemovalForm() : this.formBuilder.array([]),
        }),
        this.formBuilder.group({
          activities:
            this.levelId === '2'
              ? this.editForm
                ? this.createActivityForm()
                : this.formBuilder.array([this.createActivityForm()])
              : null,
        }),
      ]),
    });

    if (!this.editForm) {
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
  }

  showRecognitionFormSection(elementsToShow: number[]) {
    return elementsToShow.indexOf(this.reductionFormVar) >= 0;
  }

  changeReductionCurrencyValues(value: number, index: number, field: string) {
    this.formGroup.controls.formArray['controls'][3].value.reductions[index][field] = value;
  }

  changeCompensationCurrencyValues(value: number, index: number, field: string) {
    this.formGroup.controls.formArray['controls'][4].value.compensations[index][field] = value;
  }

  createReductionForm(newElement: boolean = false): UntypedFormGroup | UntypedFormArray {
    const cleanForm = this.formBuilder.group({
      reductionProjectCtrl: ['', Validators.required],
      reductionActivityCtrl: ['', Validators.required],
      reductionDetailsCtrl: ['', Validators.required],
      reducedEmissionsCtrl: ['', Validators.required],
      investmentReductions: ['CRC', Validators.required],
      investmentReductionsValue: ['', Validators.required],
      totalInvestmentReduction: ['CRC', Validators.required],
      totalInvestmentReductionValue: ['', Validators.required],
      totalEmissionsReduced: ['', Validators.required],
    });

    if (this.editForm && !newElement) {
      const reductions: UntypedFormGroup[] = [];
      if (this.ppcnEdit.organization_classification) {
        if (this.ppcnEdit.organization_classification.reduction.length > 0) {
          for (const reduction of this.ppcnEdit.organization_classification.reduction) {
            const form = this.formBuilder.group({
              id: [reduction.id],
              reductionProjectCtrl: [reduction.project, Validators.required],
              reductionActivityCtrl: [reduction.activity, Validators.required],
              reductionDetailsCtrl: [reduction.detail_reduction, Validators.required],
              reducedEmissionsCtrl: [reduction.emission, Validators.required],
              investmentReductions: [reduction.investment_currency, Validators.required],
              investmentReductionsValue: [reduction.investment, Validators.required],
              totalInvestmentReduction: [reduction.total_investment_currency, Validators.required],
              totalInvestmentReductionValue: [reduction.total_investment, Validators.required],
              totalEmissionsReduced: [reduction.total_emission, Validators.required],
            });
            reductions.push(form);
          }
        } else {
          reductions.push(cleanForm);
        }
      }

      return this.formBuilder.array(reductions);
    } else {
      return cleanForm;
    }
  }

  createcompensationForm(newElement: boolean = false): UntypedFormGroup | UntypedFormArray {
    const cleanForm = this.formBuilder.group({
      compensationScheme: ['', Validators.required],
      projectLocation: ['', Validators.required],
      certificateNumber: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      compensationCost: ['CRC', Validators.required],
      compensationCostValue: ['', Validators.required],
      period: ['', Validators.required],
      totalEmissionsOffsets: ['', Validators.required],
      totalCostCompensation: ['CRC', Validators.required],
    });

    if (this.editForm && !newElement) {
      const compensations: UntypedFormGroup[] = [];
      if (this.ppcnEdit.organization_classification) {
        if (this.ppcnEdit.organization_classification.carbon_offset.length > 0) {
          for (const compensation of this.ppcnEdit.organization_classification.carbon_offset) {
            const form = this.formBuilder.group({
              id: [compensation.id],
              compensationScheme: [compensation.offset_scheme, Validators.required],
              projectLocation: [compensation.project_location, Validators.required],
              certificateNumber: [compensation.certificate_identification, Validators.required],
              totalCompensation: [compensation.total_carbon_offset, Validators.required],
              compensationCost: [compensation.offset_cost_currency, Validators.required],
              compensationCostValue: [compensation.offset_cost, Validators.required],
              period: [compensation.period, Validators.required],
              totalEmissionsOffsets: [compensation.total_offset_cost, Validators.required],
              totalCostCompensation: [compensation.total_offset_cost_currency, Validators.required],
            });
            compensations.push(form);
          }
        } else {
          compensations.push(cleanForm);
        }
      }
      return this.formBuilder.array(compensations);
    } else {
      return cleanForm;
    }
  }

  createActivityForm(newElement: boolean = false): UntypedFormGroup | UntypedFormArray {
    if (this.editForm && !newElement) {
      const activities: UntypedFormGroup[] = [];
      if (this.ppcnEdit.gei_organization) {
        for (const activity of this.ppcnEdit.gei_organization.gei_activity_type) {
          const form = this.formBuilder.group({
            id: this.levelId === '2' ? [activity.id] : null,
            activityCtrl: this.levelId === '2' ? [activity.activity_type, Validators.required] : null,
            sectorCtrl: this.levelId === '2' ? [activity.sector.id, Validators.required] : null,
            subSectorCtrl: this.levelId === '2' ? [activity.sub_sector.id, Validators.required] : null,
          });

          activities.push(form);
        }
      }

      return this.formBuilder.array(activities);
    } else {
      return this.formBuilder.group({
        activityCtrl: this.levelId === '2' ? ['', Validators.required] : null,
        sectorCtrl: this.levelId === '2' ? ['', Validators.required] : null,
        subSectorCtrl: this.levelId === '2' ? ['', Validators.required] : null,
      });
    }
  }

  createRemovalForm(newElement: boolean = false): UntypedFormGroup | UntypedFormArray {
    if (this.editForm && !newElement) {
      const removals: UntypedFormGroup[] = [];
      for (const reduction of this.ppcnEdit.gas_removal) {
        const form = this.formBuilder.group({
          id: [reduction.id],
          costRemovalInventoryCtrl: [reduction.removal_cost],
          costRemovalInventoryValueCtrl: [reduction.removal_cost_currency],
          removalProjectDetailCtrl: [reduction.removal_descriptions],
          totalremovalsCtrl: [reduction.total],
        });
        removals.push(form);
      }
      return this.formBuilder.array(removals);
    } else {
      return this.formBuilder.group({
        costRemovalInventoryCtrl: [''],
        costRemovalInventoryValueCtrl: ['CRC'],
        removalProjectDetailCtrl: [''],
        totalremovalsCtrl: [''],
      });
    }
  }

  addItems(): void {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][7].controls['activities'];
    control.push(this.createActivityForm(true));
  }

  addReductionItem() {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][3].controls['reductions'];
    control.push(this.createReductionForm(true));
  }

  addCompensationItem() {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][4].controls['compensations'];
    control.push(this.createcompensationForm(true));
  }

  addRemovalItem() {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][6].controls['removals'];

    control.push(this.createRemovalForm(true));
  }

  deleteRemovalItem(i: number) {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][6].controls['removals'];
    control.removeAt(i);
  }

  deleteItems(i: number): void {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][7].controls['activities'];
    control.removeAt(i);
  }

  deleteReductionItem(index: number) {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][3].controls['reductions'];
    control.removeAt(index);
  }

  deleteCompensationItem(index: number) {
    const control = <UntypedFormArray>this.formGroup.controls.formArray['controls'][4].controls['compensations'];
    control.removeAt(index);
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
