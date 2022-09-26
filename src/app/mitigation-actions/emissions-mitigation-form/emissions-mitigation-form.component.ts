import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { CategoryIppc2006, MADataCatalogItem, MitigationAction, SectorIpcc2006 } from '../mitigation-action';
import { ErrorReportingComponent } from '@shared/error-reporting/error-reporting.component';
import { I18nService } from '@app/i18n';

const log = new Logger('MitigationAction');
@Component({
  selector: 'app-emissions-mitigation-form',
  templateUrl: './emissions-mitigation-form.component.html',
  styleUrls: ['./emissions-mitigation-form.component.scss'],
})
export class EmissionsMitigationFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;

  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mechanismStandardApplyModel: number;
  intendParticipateInternationalCarbonMarketsModel: number;
  mitigationAction: MitigationAction;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  sectorCatalog: MADataCatalogItem[] = [];
  sectorIppc2006: SectorIpcc2006[][] = [];
  categoryIppc2006: CategoryIppc2006[][] = [];

  gasList = ['CO2', 'CH4', 'N2O', 'HFC*', 'SF6', 'CO', 'NOx', 'NMVOC', 'SO2', 'C Negro', 'Otro'];

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.service.currentMitigationAction.subscribe((message) => (this.mitigationAction = message));
    this.createForm();
    this.getSectorCatalog();
  }

  ngOnInit() {
    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe((message) => {
        this.mitigationAction = message;
        this.updateFormData();
      });
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          exAnteEmissionReductionsCtrl: ['', Validators.required],
          periodPotentialEmissionReductionEstimatedCtrl: ['', Validators.required],
          periodPotentialEmissionReductionEstimatedOtherCtrl: ['', Validators.required],
          sectorSourceFCtrl: this.formBuilder.array([this.createSectorSourceForm()]),
          carbonSinksReservoirsCtrl: ['', Validators.required],
          definitionBaselineCtrl: ['', Validators.required],
          methodologyExantePotentialReductionEmissionsCO2Ctrl: ['', Validators.required],
          documentationCalculationsEstimateReductionEmissionsCO2Ctrl: ['', Validators.required],
          isCurrentlyReflectedInventoryCtrl: ['', Validators.required], // not true or false field
        }),
        this.formBuilder.group({
          standardizedCalculationMethodologyUsedCtrl: [''],
          standardizedCalculationMethodologyUsedDetailCtrl: ['', Validators.required],
          calculationsDocumentedCtrl: [''],
          calculationsDocumentedDetailCtrl: ['', Validators.required],
          emissionFactorsUsedCalculationDocumentedCtrl: [''],
          emissionFactorsUsedCalculationDocumentedDetailCtrl: ['', Validators.required],
          assumptionsDocumentedCtrl: [''],
          assumptionsDocumentedDetailCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          intendParticipateInternationalCarbonMarketsCtrl: ['', Validators.required],
          mechanismStandardApplyCtrl: ['', Validators.required],
          methodologyExantePotentialReductionEmissionsCO2OtherCtrl: [''],
          methodologyUsedCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private createSectorSourceForm() {
    return this.formBuilder.group({
      sectorSourceEmissionsCtrl: ['', Validators.required],
      emissionsSourceCategoryCtrl: ['', Validators.required],
      maincategoriesCtrl: ['', Validators.required],
    });
  }

  private getSectorCatalog() {
    this.service.getAllMAData().subscribe((response) => {
      this.sectorCatalog = response.sector;
    });
  }

  public selectSectorCatalog(id: string, index: number) {
    this.service.getSectorIppc2006(id).subscribe((response) => {
      this.sectorIppc2006[index] = response;
    });
  }

  public selectSectorIppcCatalog(id: string, index: number) {
    this.service.getCategoryIppc2006(id).subscribe((response) => {
      this.categoryIppc2006[index] = response;
    });
  }

  public removeSectorItem(index: number) {
    const control = <FormArray>this.form.controls.formArray['controls'][0].controls['sectorSourceFCtrl'];
    control.removeAt(index);
  }

  public addSectorItem() {
    const control = <FormArray>this.form.controls.formArray['controls'][0].controls['sectorSourceFCtrl'].controls;
    control.push(this.createSectorSourceForm());
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          exAnteEmissionReductionsCtrl: [
            this.mitigationAction.impact_documentation.estimate_reduction_co2,
            Validators.required,
          ],
          periodPotentialEmissionReductionEstimatedCtrl: [
            this.mitigationAction.impact_documentation.period_potential_reduction,
            Validators.required,
          ],
          periodPotentialEmissionReductionEstimatedOtherCtrl: ['', Validators.required],
          carbonSinksReservoirsCtrl: ['', Validators.required],
          definitionBaselineCtrl: [
            this.mitigationAction.impact_documentation.base_line_definition,
            Validators.required,
          ],
          methodologyExantePotentialReductionEmissionsCO2Ctrl: [
            this.mitigationAction.impact_documentation.calculation_methodology,
            Validators.required,
          ],
          documentationCalculationsEstimateReductionEmissionsCO2Ctrl: [
            this.mitigationAction.impact_documentation.estimate_calculation_documentation,
            Validators.required,
          ],
          isCurrentlyReflectedInventoryCtrl: [
            this.mitigationAction.impact_documentation.mitigation_action_in_inventory ? 1 : 2,
            Validators.required,
          ],
        }),
        this.formBuilder.group({
          standardizedCalculationMethodologyUsedCtrl: [this.mitigationAction.impact_documentation.question[0].check],
          standardizedCalculationMethodologyUsedDetailCtrl: [
            this.mitigationAction.impact_documentation.question[0].detail,
            Validators.required,
          ],
          calculationsDocumentedCtrl: [this.mitigationAction.impact_documentation.question[1].check],
          calculationsDocumentedDetailCtrl: [
            this.mitigationAction.impact_documentation.question[1].detail,
            Validators.required,
          ],
          emissionFactorsUsedCalculationDocumentedCtrl: [this.mitigationAction.impact_documentation.question[2].check],
          emissionFactorsUsedCalculationDocumentedDetailCtrl: [
            this.mitigationAction.impact_documentation.question[2].detail,
            Validators.required,
          ],
          assumptionsDocumentedCtrl: [this.mitigationAction.impact_documentation.question[3].check],
          assumptionsDocumentedDetailCtrl: [
            this.mitigationAction.impact_documentation.question[3].detail,
            Validators.required,
          ],
        }),
        this.formBuilder.group({
          intendParticipateInternationalCarbonMarketsCtrl: [
            this.mitigationAction.impact_documentation.carbon_international_commerce,
            Validators.required,
          ],
          mechanismStandardApplyCtrl: ['', Validators.required],
          methodologyExantePotentialReductionEmissionsCO2OtherCtrl: [''],
          methodologyUsedCtrl: [this.mitigationAction.impact_documentation.methodologies_to_use, Validators.required],
        }),
      ]),
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  buildPayload() {
    const sectorSourceList = [];
    for (const element of this.form.controls.formArray['controls'][0].controls['sectorSourceFCtrl'].controls) {
      const newElement = {
        sector: element.value.sectorSourceEmissionsCtrl,
        sector_ipcc_2006: element.value.emissionsSourceCategoryCtrl,
        category_ipcc_2006: element.value.maincategoriesCtrl,
        sub_category_ipcc_2006: [1], // check it later
      };
      sectorSourceList.push(newElement);
    }

    const payload = {
      impact_documentation: {
        estimate_reduction_co2: this.form.value.formArray[0].exAnteEmissionReductionsCtrl,
        period_potential_reduction: this.form.value.formArray[0].periodPotentialEmissionReductionEstimatedCtrl,
        base_line_definition: this.form.value.formArray[0].definitionBaselineCtrl,
        calculation_methodology: this.form.value.formArray[0].methodologyExantePotentialReductionEmissionsCO2Ctrl,
        estimate_calculation_documentation: this.form.value.formArray[0]
          .documentationCalculationsEstimateReductionEmissionsCO2Ctrl,
        mitigation_action_in_inventory: this.form.value.formArray[0].isCurrentlyReflectedInventoryCtrl,
        carbon_international_commerce: this.form.value.formArray[2].intendParticipateInternationalCarbonMarketsCtrl,
        methodologies_to_use: this.form.value.formArray[2].methodologyUsedCtrl
          ? this.form.value.formArray[2].methodologyUsedCtrl
          : null,
        sector_selection: sectorSourceList,
        question: [
          {
            code: 'Q1',
            question: 'mitigationAction.standardizedCalculationMethodologyUsed',
            check: this.form.value.formArray[1].standardizedCalculationMethodologyUsedCtrl,
            detail: this.form.value.formArray[1].standardizedCalculationMethodologyUsedDetailCtrl,
          },
          {
            code: 'Q2',
            question: 'mitigationAction.calculationsDocumented',
            check: this.form.value.formArray[1].calculationsDocumentedCtrl,
            detail: this.form.value.formArray[1].calculationsDocumentedDetailCtrl,
          },
          {
            code: 'Q3',
            question: 'mitigationAction.emissionFactorsUsedCalculationDocumented',
            check: this.form.value.formArray[1].emissionFactorsUsedCalculationDocumentedCtrl,
            detail: this.form.value.formArray[1].emissionFactorsUsedCalculationDocumentedDetailCtrl,
          },
          {
            code: 'Q4',
            question: 'mitigationAction.assumptionsDocumented',
            check: this.form.value.formArray[1].assumptionsDocumentedCtrl,
            detail: this.form.value.formArray[1].assumptionsDocumentedDetailCtrl,
          },
        ],
      },
    };

    return payload;
  }

  submitForm() {
    this.isLoading = true;
    const context = this.buildPayload();

    this.service
      .submitMitigationActionUpdateForm(context, this.mitigationAction.id)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          this.wasSubmittedSuccessfully = true;
          this.stepper.next();
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`New Mitigation Action Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
          this.wasSubmittedSuccessfully = false;
        }
      );
  }

  public setLastSectionValidations(validation: number) {
    if (validation === 1) {
      this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').setValidators(Validators.required);
      this.form.get('formArray').get([2]).get('methodologyUsedCtrl').setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').setValidators(null);
      this.form.get('formArray').get([2]).get('methodologyUsedCtrl').setValidators(null);
    }

    this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').updateValueAndValidity();
    this.form.get('formArray').get([2]).get('methodologyUsedCtrl').updateValueAndValidity();
  }
}
