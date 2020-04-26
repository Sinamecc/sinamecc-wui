import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Ppcn, GeographicLevel, SubSector } from '@app/ppcn/ppcn_registry'
import { PpcnNewFormData, Ovv } from '@app/ppcn/ppcn-new-form-data';
import { BehaviorSubject } from 'rxjs';
import { PpcnReview } from '@app/ppcn/ppcn-review';
import { S3File, S3Service } from '@app/core/s3.service';
import { StatusRoutesMap } from '@app/ppcn/status-routes-map';

const routes = {
  getGeographicLevel: (lang: string) => `/v1/ppcn/geographic/level/${lang}`,
  getRequiredLevel: () => `/v1/ppcn/required/level`,
  seededFormData: (levelId: string, lang: string) => `/v1/ppcn/form/${levelId}/${lang}`,
  ppcns: (lang: string) => `/v1/ppcn/${lang}`,
  ppcnsAll: (lang:string) => `/v1/ppcn/all/${lang}`,
  submitNewPpcn: () => `/v1/ppcn/`,
  submitUpdatePpcn: (ppcnId: string) => `/v1/ppcn/${ppcnId}`,
  subsectors: (subsector: string, lang: string) => `/v1/ppcn/${subsector}/subsector/${lang}/`,
  deletePpcn: (uuid: string) => `/v1/ppcn/${uuid}`,
  getPpcn: (uuid: string, lang: string) => `/v1/ppcn/${uuid}/${lang}`,
  submitNewFilePPCN: () => `/v1/ppcn/file/`,
  ppcnReviews: (id: string) => `/v1/ppcn/changelog/${id}`,
  getAllOvv: () => `/v1/ppcn/ovv/`,
  ppcnAvailableStatuses: () => `/v1/workflow/status`,

}

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
  geographic?: string;

}

const fsm_next_state = {
  "PPCN_decision_step_DCC": ['PPCN_accepted_request_by_DCC', 'PPCN_rejected_request_by_DCC', 'PPCN_changes_requested_by_DCC'],
  "PPCN_evaluation_by_CA": ["PPCN_decision_step_CA"],
  "PPCN_decision_step_CA": ["PPCN_accepted_request_by_CA", "PPCN_rejected_request_by_CA"]
}

export interface ReportContext {
  comment: string;
  file: string | any;
}

@Injectable()
export class PpcnService {

  private pccnLevelId = new BehaviorSubject('');
  currentLevelId = this.pccnLevelId.asObservable();


  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3: S3Service) {

  }

  submitNewPpcnForm(context: any): Observable<Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let formData = this.buildFormData(context);
    return this.httpClient
      .post(routes.submitNewPpcn(), formData, httpOptions)
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            id: body.id,
            geographic: body.geographicLevel,
            message: 'Form submitted correctly'
          };
          return response;
        })
      );

  }

  submitUpdatePpcnForm(context: any,
    id: string,
    contactFormId: number,
    geographicFormId: number,
    requiredFormId: number,
    recognitionFormId: number,
    sectorFormId: number,
    subsectorFormId: number,
    ovvFormId: number): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let formData = this.buildFormData(context, contactFormId, geographicFormId, requiredFormId, recognitionFormId, sectorFormId, subsectorFormId, ovvFormId);
    return this.httpClient
      .put(routes.submitUpdatePpcn(id), formData, httpOptions)
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            id: body.id,
            geographic: "",
            message: 'Form updated correctly'
          };
          return response;
        })
      );

  }

  deletePpcn(uuid: string): Observable<{} | Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const url = routes.deletePpcn(uuid);
    // routes.deleteMitigationAction(uuid)
    return this.httpClient
      .delete(url, httpOptions)
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'PPCN deleted correctly'
          };
          return response;
        })
      );

  }

  updateCurrentGeographicalLevel(newGeographicalLevelId: string) {
    this.pccnLevelId.next(newGeographicalLevelId);
  }

  ppcn(lang: string): Observable<Ppcn[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.ppcns(lang), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  ppcnAll(lang: string): Observable < Ppcn[] > {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.ppcnsAll(lang), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }

  reRoutePpcn(lang: string): Observable < Ppcn[] > {
    return this.ppcn(lang)
  }

  geographicLevel(lang: string): Observable<GeographicLevel[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.getGeographicLevel(lang), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  ovvFormData(): Observable<Ovv> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.getAllOvv(), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }

  newPpcnFormData(levelId: string, lang: string): Observable<PpcnNewFormData> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.seededFormData(levelId, lang), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }

  subsectors(sector: string, lang: string): Observable<SubSector[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.subsectors(sector, lang), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      )

  }

  getPpcn(uuid: string, lang: string): Observable<Ppcn> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.getPpcn(uuid, lang), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }

  submitPpcnNewFile(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let fileList = context.files;

    let formData: FormData = new FormData();
    formData.append('ppcn_form', context.ppcnCtrl);

    if (fileList.length > 0) {
      for (let file of fileList) {
        let fileToUpload = file.file.files[0];
        formData.append('files[]', fileToUpload, fileToUpload.name);
      }
      return this.httpClient
        .post(routes.submitNewFilePPCN(), formData, httpOptions)
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Files submitted correctly'
            };
            return response;
          })
        );
    } else {
      // raise exception
    }

  }

  ppcnReviews(id: string): Observable<PpcnReview[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.ppcnReviews(id), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  getPpcnReviewStatuses(): Observable<PpcnNewFormData> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.ppcnAvailableStatuses(), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  commonStatusses(ppcn: Ppcn): string[] {
    return fsm_next_state[ppcn.fsm_state];
  }

  mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
    return [
      { route: `ppcn/${uuid}/edit`, status: 'PPCN_changes_requested_by_DCC' },
      // implementing_INGEI_changes
    ];
  }

  private buildFormData(context: any,
    contactFormId: number = null,
    geographicFormId: number = null,
    requiredFormId: number = null,
    recognitionFormId: number = null,
    sectorFormId: number = null,
    subsectorFormId: number = null,
    geiOrganizationId: number = null,
  ) {
    let formData = {};
    let organization = {};
    let contact = {};
    let geiOrganization = {};
    let geiActivityTypes = {};
    let reduction = {};
    let carbonOffset = {};
    let organization_classification = {};

    this.currentLevelId.subscribe(levelId => formData['geographic_level'] = levelId);
    formData['user'] = String(this.authenticationService.credentials.id);
    if (geographicFormId) {
      formData['geographic_level'] = String(geographicFormId);
    }



    formData['subsector'] = context.formArray[4].subSectorCtrl;
    formData['sector'] = context.formArray[4].sectorCtrl;

    organization['name'] = context.formArray[0].nameCtrl;
    organization['representative_name'] = context.formArray[0].representativeNameCtrl;
    organization['representative_legal_identification'] = context.formArray[0].legalRepresentativeIdCtrl;
    organization['legal_identification'] = context.formArray[0].legalIdCtrl;
    organization['confidential'] = context.formArray[0].confidentialCtrl;
    organization['confidential_fields'] = context.formArray[0].confidentialValueCtrl;
    
    organization['phone_organization'] = context.formArray[0].telephoneCtrl;
    organization['postal_code'] = context.formArray[0].postalCodeCtrl;
    organization['fax'] = context.formArray[0].faxCtrl;
    organization['ciiu_code_list'] = [];

    // Reduction form section //
    reduction['proyect'] = context.formArray[3].reductionProjectCtrl;
    reduction['activity']= context.formArray[3].reductionActivityCtrl;
    reduction['detail_reduction']= context.formArray[3].reductionDetailsCtrl;
    reduction['emission']= context.formArray[3].reducedEmissionsCtrl;
    reduction['total_emission']= context.formArray[3].totalEmisionesReducidas;
    reduction['investment']= context.formArray[3].investmentReductionsValue;
    reduction['investment_currency']= context.formArray[3].investmentReductions;
    reduction['total_investment']= context.formArray[3].totalInvestmentReductionValue;
    reduction['total_investment_currency']= context.formArray[3].totalInvestmentReduction;

    // carbon offset form section 
    carbonOffset['offset_scheme'] = context.formArray[4].compensationScheme;
    carbonOffset['project_location'] = context.formArray[4].projectLocation;
    carbonOffset['certificate_identification'] = context.formArray[4].certificateNumber;
    carbonOffset['total_carbon_offset'] = context.formArray[4].totalCompensation;
    carbonOffset['offset_cost'] = context.formArray[4].compensationCostValue;
    carbonOffset['offset_cost_currency'] = context.formArray[4].compensationCost;
    carbonOffset['period'] = context.formArray[4].period;
    carbonOffset['total_offset_cost'] = context.formArray[4].totalEmissionsOffsets;
    carbonOffset['total_offset_cost_currency'] = context.formArray[4].totalCostCompensation;



    organization_classification['required_level'] = context.formArray[2].requiredCtrl;
    organization_classification['recognition_type'] = context.formArray[2].recognitionCtrl;
    organization_classification['emission_quantity'] = context.formArray[2].amountOfEmissions;
    organization_classification['buildings_number'] = context.formArray[2].numberofDacilities;
    organization_classification['data_inventory_quantity'] = context.formArray[2].amountInventoryData;
    organization_classification['reduction'] = reduction;
    organization_classification['carbon_offset'] = carbonOffset;

    formData['organization_classification'] =  organization_classification; 

    
    for(let value of context.formArray[0].ciuuListCodeCtrl){
      const element = {
        "ciiu_code": value
      }
      organization['ciiu_code_list'].push(element)
    }
    organization['address'] = context.formArray[0].addressCtrl;

    if (contactFormId) {
      contact['id'] = String(contactFormId);
    }
    contact['full_name'] = context.formArray[1].contactNameCtrl;
    contact['job_title'] = context.formArray[1].positionCtrl;
    contact['email'] = context.formArray[1].emailFormCtrl;
    contact['phone'] = context.formArray[1].phoneCtrl;

    organization['contact'] = contact;
    formData['organization'] = organization;

    if (context.formArray[3].ovvCtrl == '' || context.formArray[3].ovvCtrl == null) {
      formData['base_year'] = this.datePipe.transform(context.formArray[3].reportYearCtrl, 'yyyy-MM-dd');
    }
    else {
      if (geiOrganizationId) {
        geiOrganization['id'] = String(geiOrganizationId);
      }
      // geiOrganization['activity_type'] = context.formArray[4].activityCtrl;
      geiOrganization['ovv'] = context.formArray[3].ovvCtrl;
      geiOrganization['emission_ovv_date'] = this.datePipe.transform(context.formArray[3].implementationEmissionDateCtrl, 'yyyy-MM-dd');
      geiOrganization['base_year'] = context.formArray[3].baseYearCtrl;
      geiOrganization['report_year'] = context.formArray[3].reportYearCtrl;

      formData['gei_organization'] = geiOrganization;
    }
    formData['gei_activity_types'] = [];
    if (context.formArray[4].activities) {
      context.formArray[4].activities.forEach((activity: any) => {

        const objectToPush = {
          'activity_type': activity.activityCtrl,
          'sub_sector': activity.subSectorCtrl,
          'sector': activity.sectorCtrl
        }
        formData['gei_activity_types'].push(objectToPush);
      });
    }
    return formData;
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

}
