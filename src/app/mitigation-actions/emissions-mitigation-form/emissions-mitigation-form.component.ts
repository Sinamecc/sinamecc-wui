import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import {
  MAStates,
  CategoryIppc2006,
  MADataCatalogItem,
  MAFileType,
  MitigationAction,
  SectorIpcc2006,
} from '../mitigation-action';
import { ErrorReportingComponent } from '@shared/error-reporting/error-reporting.component';
import { I18nService } from '@app/i18n';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAFile } from '../mitigation-action-file-upload/file-upload';

const log = new Logger('MitigationAction');
@Component({
  selector: 'app-emissions-mitigation-form',
  templateUrl: './emissions-mitigation-form.component.html',
  styleUrls: ['./emissions-mitigation-form.component.scss'],
  standalone: false,
})
export class EmissionsMitigationFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  @Output() state = new EventEmitter<MAStates>();

  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mechanismStandardApplyModel: number;
  intendParticipateInternationalCarbonMarketsModel: boolean;
  mitigationAction: MitigationAction;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  sectorCatalog: MADataCatalogItem[] = [];
  sectorIppc2006: SectorIpcc2006[][] = [];
  categoryIppc2006: CategoryIppc2006[][] = [];
  maFileType = MAFileType.IMPACT_DOCUMENTATION;
  newFiles: File[] = [];
  files: MAFile[] = [];

  gasList = ['CO2', 'CH4', 'N2O', 'HFC*', 'SF6', 'CO', 'NOx', 'NMVOC', 'SO2', 'C Negro', 'Otro'];

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private router: Router,
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
        this.state.emit(this.mitigationAction.fsm_state.state as MAStates);
        this.files = this.getFiles();
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
          carbonSinksReservoirsCtrl: [''],
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
          mechanismStandardApplyCtrl: [''],
          methodologyExantePotentialReductionEmissionsCO2OtherCtrl: [''],
          methodologyUsedCtrl: [''],
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

  private createSectorSourceEditForm() {
    const sectorSourceFormList = [];
    let index = 0;

    if (this.mitigationAction.impact_documentation.sector_selection)
      for (const sector of this.mitigationAction.impact_documentation.sector_selection) {
        const form = this.formBuilder.group({
          sectorSourceEmissionsCtrl: [sector.sector.id, Validators.required],
          emissionsSourceCategoryCtrl: [sector.sector_ipcc_2006.id, Validators.required],
          maincategoriesCtrl: [sector.category_ipcc_2006.id, Validators.required],
          id: [sector.id],
        });

        sectorSourceFormList.push(form);
        this.selectSectorCatalog(sector.sector.id, index);
        this.selectSectorIppcCatalog(sector.sector_ipcc_2006.id, index);
        index += 1;
      }

    return sectorSourceFormList;
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
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][0].controls['sectorSourceFCtrl'];
    control.removeAt(index);
  }

  public addSectorItem() {
    const control = <UntypedFormArray>(
      this.form.controls.formArray['controls'][0].controls['sectorSourceFCtrl'].controls
    );
    control.push(this.createSectorSourceForm());
  }

  private updateFormData() {
    this.intendParticipateInternationalCarbonMarketsModel =
      this.mitigationAction.impact_documentation.carbon_international_commerce;
    this.mechanismStandardApplyModel = this.mitigationAction.impact_documentation.standard
      ? parseInt(this.mitigationAction.impact_documentation.standard.id)
      : 0;
    const question = this.mitigationAction.impact_documentation.question;
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
          periodPotentialEmissionReductionEstimatedOtherCtrl: [
            this.mitigationAction.impact_documentation.gases
              ? this.mitigationAction.impact_documentation.gases.split(',')
              : '',
            Validators.required,
          ],
          sectorSourceFCtrl: this.formBuilder.array(this.createSectorSourceEditForm()),
          carbonSinksReservoirsCtrl: [
            this.mitigationAction.impact_documentation.carbon_deposit.map((x: { id: any }) => x.id),
          ],
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
          standardizedCalculationMethodologyUsedCtrl: [question ? question[0].is_checked : false],
          standardizedCalculationMethodologyUsedDetailCtrl: [question ? question[0].detail : '', Validators.required],
          calculationsDocumentedCtrl: [question ? question[1].is_checked : false],
          calculationsDocumentedDetailCtrl: [question ? question[1].is_checked : '', Validators.required],
          emissionFactorsUsedCalculationDocumentedCtrl: [question ? question[2].is_checked : false],
          emissionFactorsUsedCalculationDocumentedDetailCtrl: [question ? question[2].detail : '', Validators.required],
          assumptionsDocumentedCtrl: [question ? question[3].is_checked : false],
          assumptionsDocumentedDetailCtrl: [question ? question[3].detail : '', Validators.required],
        }),
        this.formBuilder.group({
          intendParticipateInternationalCarbonMarketsCtrl: [
            this.mitigationAction.impact_documentation.carbon_international_commerce,
            [Validators.required],
          ],
          mechanismStandardApplyCtrl: [this.mechanismStandardApplyModel],
          methodologyExantePotentialReductionEmissionsCO2OtherCtrl: [''],
          methodologyUsedCtrl: [this.mitigationAction.impact_documentation.methodologies_to_use],
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

      if (element.value.id) {
        newElement['id'] = element.value.id;
      }

      sectorSourceList.push(newElement);
    }
    const payload = {
      impact_documentation: {
        gases: this.form.value.formArray[0].periodPotentialEmissionReductionEstimatedOtherCtrl.toString(),
        standard: this.form.value.formArray[2].mechanismStandardApplyCtrl,
        carbon_deposit: this.form.value.formArray[0].carbonSinksReservoirsCtrl
          ? this.form.value.formArray[0].carbonSinksReservoirsCtrl
          : [],
        estimate_reduction_co2: this.form.value.formArray[0].exAnteEmissionReductionsCtrl,
        period_potential_reduction: this.form.value.formArray[0].periodPotentialEmissionReductionEstimatedCtrl,
        base_line_definition: this.form.value.formArray[0].definitionBaselineCtrl,
        calculation_methodology: this.form.value.formArray[0].methodologyExantePotentialReductionEmissionsCO2Ctrl,
        estimate_calculation_documentation:
          this.form.value.formArray[0].documentationCalculationsEstimateReductionEmissionsCO2Ctrl,
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
            is_checked: this.form.value.formArray[1].standardizedCalculationMethodologyUsedCtrl,
            detail: this.form.value.formArray[1].standardizedCalculationMethodologyUsedDetailCtrl,
          },
          {
            code: 'Q2',
            question: 'mitigationAction.calculationsDocumented',
            is_checked: this.form.value.formArray[1].calculationsDocumentedCtrl,
            detail: this.form.value.formArray[1].calculationsDocumentedDetailCtrl,
          },
          {
            code: 'Q3',
            question: 'mitigationAction.emissionFactorsUsedCalculationDocumented',
            is_checked: this.form.value.formArray[1].emissionFactorsUsedCalculationDocumentedCtrl,
            detail: this.form.value.formArray[1].emissionFactorsUsedCalculationDocumentedDetailCtrl,
          },
          {
            code: 'Q4',
            question: 'mitigationAction.assumptionsDocumented',
            is_checked: this.form.value.formArray[1].assumptionsDocumentedCtrl,
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
        }),
      )
      .subscribe(
        async (response) => {
          await this.successSendForm(response.id, response.state as MAStates);
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`New Mitigation Action Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
          this.wasSubmittedSuccessfully = false;
        },
      );
  }

  async successSendForm(id: string, state: MAStates) {
    if (this.newFiles.length) {
      await this.service.submitFiles(id, this.maFileType, this.newFiles);
    }

    this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
    });
    this.wasSubmittedSuccessfully = true;
    this.state.emit(state);
    this.stepper.next();
  }

  public setLastSectionValidations(validation: boolean) {
    if (validation) {
      this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').setValidators(Validators.required);
      this.form.get('formArray').get([2]).get('methodologyUsedCtrl').setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').setValidators(null);
      this.form.get('formArray').get([2]).get('methodologyUsedCtrl').setValidators(null);
    }

    this.form.get('formArray').get([2]).get('mechanismStandardApplyCtrl').updateValueAndValidity();
    this.form.get('formArray').get([2]).get('methodologyUsedCtrl').updateValueAndValidity();
  }

  addFiles(files: File[]) {
    this.newFiles = files;
  }

  getFiles() {
    return this.mitigationAction.files.filter((file) => file.type === this.maFileType);
  }

  onStepChange() {
    this.wasSubmittedSuccessfully = false;
  }
}
