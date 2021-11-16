import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { tap, finalize } from 'rxjs/operators';
import { I18nService } from '@app/i18n/i18n.service';
const log = new Logger('Report');

@Component({
  selector: 'app-ppcn-upload',
  templateUrl: './ppcn-upload.component.html',
  styleUrls: ['./ppcn-upload.component.scss'],
})
export class PpcnUploadComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  files: FormArray;
  ppcns: Observable<Ppcn[]>;
  processedPpcns: Ppcn[] = [];
  id: number;

  ppcn: Ppcn;

  fileDetailPPCNOrga = [
    {
      name: 'ppcnDocument.legalPerson',
      description: 'ppcnDocument.legalPersonDescription',
    },
    {
      name: 'ppcnDocument.physicalPerson',
      description: 'ppcnDocument.physicalPersonDescription',
    },
    {
      name: 'ppcnDocument.CCSSWorkerFees',
      description: 'ppcnDocument.CCSSWorkerFeesDescription',
    },
    {
      name: 'ppcnDocument.sanitaryPermit',
      description: 'ppcnDocument.sanitaryPermitDescription',
    },
    {
      name: 'ppcnDocument.municipalObligations',
      description: 'ppcnDocument.municipalObligationsDescription',
    },
    {
      name: 'ppcnDocument.openConvictions',
      description: 'ppcnDocument.openConvictionsDescription',
    },
    {
      name: 'ppcnDocument.GEIreport',
      description: 'ppcnDocument.GEIreportDescription',
    },
    {
      name: 'ppcnDocument.GEIManagementPlan',
      description: 'ppcnDocument.GEIManagementPlanDescription',
    },
    {
      name: 'ppcnDocument.verificationreportOVV',
      description: 'ppcnDocument.verificationreportOVVDescription',
    },
    {
      name: 'ppcnDocument.copyGEIVerification',
      description: 'ppcnDocument.copyGEIVerificationDescription',
    },
    {
      name: 'ppcnDocument.ownRemovals',
      description: 'ppcnDocument.ownRemovalsDescription',
    },
    {
      name: 'ppcnDocument.organizationLogo',
      description: 'ppcnDocument.organizationLogoDescription',
    },
  ];

  fileDetailPPCNCant = [
    {
      name: 'ppcnDocument.geiReportCant',
      description: 'ppcnDocument.geiReportCantDescription',
    },
    {
      name: 'ppcnDocument.verificationReport',
      description: 'ppcnDocument.verificationReportDescription',
    },
    {
      name: 'ppcnDocument.mitigationActionPlan',
      description: 'ppcnDocument.mitigationActionPlanDescription',
    },
    {
      name: 'ppcnDocument.certificateCompensation',
      description: 'ppcnDocument.certificateCompensationDescription',
    },
  ];

  fileDetail: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private translateService: TranslateService,
    private ppcnService: PpcnService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  submitForm() {
    this.isLoading = true;
    this.ppcnService
      .submitPpcnNewFile(this.form.value)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/ppcn/registries'], { replaceUrl: true });
          this.translateService.get('Sucessfully submitted file').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error) => {
          log.debug(`PPCN File error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.ppcns = this.initialFormData().pipe(
      tap((ppcns: Ppcn[]) => {
        this.processedPpcns = ppcns;

        this.ppcn = this.processedPpcns.find((ppcnToFind) => Number(ppcnToFind.id) === this.id);

        const numberOfItems = this.ppcn.geographic_level.id === 1 ? 4 : 12;

        this.form = this.formBuilder.group({
          ppcnCtrl: [this.ppcn.id, Validators.required],
          files: this.formBuilder.array(
            Array.from({ length: numberOfItems }, (_, i) => i + 1).map((_) => {
              return this.createItem();
            })
          ),
        });

        if (this.ppcn.geographic_level.id === 1) {
          this.fileDetail = this.fileDetailPPCNCant;
        } else {
          this.fileDetail = this.fileDetailPPCNOrga;
          const idRecognition = this.ppcn.organization_classification.recognition_type;
          this.loadDocumentsByRecognitionType(idRecognition.id);
        }
      })
    );
  }

  loadDocumentsByRecognitionType(id: Number) {
    const idNeutralCarbonDocuments = 9;
    const idNeutralCarbonPlus = 10;
    const idCarbonoReductionPlus = 8;
    const neutralCarbonDocuments = [
      {
        name: 'ppcnDocument.purchaseCertificate',
        description: 'ppcnDocument.purchaseCertificateDescription',
      },
      {
        name: 'ppcnDocument.formalConclusionVV',
        description: 'ppcnDocument.formalConclusionVVDescription',
      },
    ];
    const neutralCarbonPlus = [
      {
        name: 'ppcnDocument.FONAFIFOPurchaseCertificate',
        description: 'ppcnDocument.FONAFIFOPurchaseCertificateDescription',
      },
      {
        name: 'ppcnDocument.supportingEvidence',
        description: 'ppcnDocument.supportingEvidenceDescription',
      },
      {
        name: 'ppcnDocument.evidenceOVVConclusion',
        description: 'ppcnDocument.evidenceOVVConclusionDescription',
      },
    ];

    const carbonoReductionPlus = {
      name: 'ppcnDocument.evidenceActionsTaken',
      description: 'ppcnDocument.evidenceActionsTakenDescription',
    };

    if (id === idNeutralCarbonPlus) {
      this.fileDetail = this.fileDetail.concat(neutralCarbonPlus);
      for (const element of neutralCarbonPlus) {
        this.addFile();
      }
    }

    if (id === idNeutralCarbonDocuments) {
      this.fileDetail = this.fileDetail.concat(neutralCarbonDocuments);
      for (const element of neutralCarbonDocuments) {
        this.addFile();
      }
    }

    if (id === idCarbonoReductionPlus) {
      this.fileDetail.push(carbonoReductionPlus);
      this.addFile();
    }
  }

  private createItem(): FormGroup {
    return this.formBuilder.group({
      file: [{ value: undefined, disabled: false }, []],
    });
  }
  private addFile(): void {
    const control = <FormArray>this.form.controls['files'];
    control.push(this.createItem());
  }

  private removeFile(i: number) {
    const control = <FormArray>this.form.controls['files'];
    control.removeAt(i);
  }

  private initialFormData(): Observable<Ppcn[]> {
    return this.ppcnService.ppcn(this.i18nService.language.split('-')[0]).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
}
