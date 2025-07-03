import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionsActionImpactComponent } from '../adaptation-actions-action-impact/adaptation-actions-action-impact.component';
import { AdaptationActionsClimateMonitoringComponent } from '../adaptation-actions-climate-monitoring/adaptation-actions-climate-monitoring.component';
import { AdaptationActionsFinancingComponent } from '../adaptation-actions-financing/adaptation-actions-financing.component';
import { AdaptationActionsIndicatorsComponent } from '../adaptation-actions-indicators/adaptation-actions-indicators.component';
import { AdaptationActionsReportComponent } from '../adaptation-actions-report/adaptation-actions-report.component';
import { AdaptationActionService } from '../adaptation-actions-service';
import { GeneralRegisterComponent } from '../general-register/general-register.component';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AAType } from '../interfaces/catalogs';

@Component({
  selector: 'app-adaptation-actions-new',
  templateUrl: './adaptation-actions-new.component.html',
  styleUrls: ['./adaptation-actions-new.component.scss'],
  standalone: false,
})
export class AdaptationActionsNewComponent implements OnInit, AfterViewInit {
  durationInSeconds = 3;
  loading = false;

  @ViewChild(GeneralRegisterComponent)
  generalRegisterForm: GeneralRegisterComponent;

  @ViewChild(AdaptationActionsReportComponent)
  reportForm: AdaptationActionsReportComponent;

  @ViewChild(AdaptationActionsFinancingComponent)
  financingForm: AdaptationActionsFinancingComponent;

  @ViewChild(AdaptationActionsIndicatorsComponent)
  indicatorForm: AdaptationActionsIndicatorsComponent;

  @ViewChild(AdaptationActionsClimateMonitoringComponent)
  climateMonitoringForm: AdaptationActionsClimateMonitoringComponent;

  @ViewChild(AdaptationActionsActionImpactComponent)
  impactForm: AdaptationActionsActionImpactComponent;

  mainGroup: UntypedFormGroup;
  adaptationAction: AdaptationAction;
  edit: boolean;

  aaType: AAType | null;
  completed: Record<string, boolean> = {
    generalRegister: false,
    report: false,
    financing: false,
    indicators: false,
    climateMonitoring: false,
    actionImpact: false,
  };

  assistantOpen = true;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private service: AdaptationActionService,
    public snackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.edit = id ? true : false;
    if (this.edit) {
      this.loading = true;
      this.loadAdaptationActions(id);
      this.assistantOpen = false;
    }
    this.createForm();
  }

  get formArray(): AbstractControl | null {
    return this.mainGroup.get('formArray');
  }

  handleAssistantOpen() {
    this.assistantOpen = !this.assistantOpen;
  }

  ngOnInit() {
    this.openStartMessages();
  }

  onComplete(key: string, completed: boolean) {
    this.completed = {
      ...this.completed,
      [key]: completed,
    };
  }

  loadAdaptationActions(id: string) {
    this.service.loadOneAdaptationActions(id).subscribe((response) => {
      this.adaptationAction = response;
      this.loading = false;
    });
  }

  createForm() {
    this.mainGroup = this._formBuilder.group({
      // this.formBuilder.array([])
      formArray: this._formBuilder.array([
        this.generalRegisterFrm,
        this.reportFrm,
        this.financingFrm,
        this.indicatorFrm,
        this.climateMoniotoringFrm,
        this.impactFrm,
      ]),
    });
  }

  get generalRegisterFrm() {
    return this.generalRegisterForm ? this.generalRegisterForm.form : null;
  }

  get reportFrm() {
    return this.reportForm ? this.reportForm.form : null;
  }

  get financingFrm() {
    return this.financingForm ? this.financingForm.form : null;
  }

  get indicatorFrm() {
    return this.indicatorForm ? this.indicatorForm.form : null;
  }

  get climateMoniotoringFrm() {
    return this.climateMonitoringForm ? this.climateMonitoringForm.form : null;
  }

  get impactFrm() {
    return this.impactForm ? this.impactForm.form : null;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    setTimeout(() => this.createForm(), 0);
  }

  public openStartMessages() {
    this.translateService.get('adaptationAction.mesage1').subscribe((res: string) => {
      this.snackBar.open(res, 'Cerrar');
    });
  }
}
