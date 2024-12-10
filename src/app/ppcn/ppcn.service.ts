import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PpcnNewFormData, Ovv } from '@app/ppcn/ppcn-new-form-data';
import { BehaviorSubject } from 'rxjs';
import { PpcnReview } from '@app/ppcn/ppcn-review';
import { S3File, S3Service } from '@shared/s3.service';
import { StatusRoutesMap } from '@app/ppcn/status-routes-map';
import { Ppcn } from './ppcn_registry';
import { GeographicLevel } from './interfaces/geographicLevel';
import { SubSector } from './interfaces/subSector';
import { CredentialsService } from '@app/auth';

const routes = {
  getGeographicLevel: (lang: string) => `/v1/ppcn/geographic/level/${lang}`,
  getRequiredLevel: () => `/v1/ppcn/required/level`,
  seededFormData: (levelId: string, lang: string) => `/v1/ppcn/form/${levelId}/${lang}`,
  ppcns: (lang: string) => `/v1/ppcn/${lang}`,
  ppcnsAll: (lang: string) => `/v1/ppcn/all/${lang}`,
  submitNewPpcn: () => `/v1/ppcn/`,
  submitUpdatePpcn: (ppcnId: string) => `/v1/ppcn/${ppcnId}`,
  subsectors: (subsector: string, lang: string) => `/v1/ppcn/${subsector}/subsector/${lang}/`,
  deletePpcn: (uuid: string) => `/v1/ppcn/${uuid}`,
  getPpcn: (uuid: string, lang: string) => `/v1/ppcn/${uuid}/${lang}`,
  submitNewFilePPCN: () => `/v1/ppcn/file/`,
  ppcnReviews: (id: string) => `/v1/ppcn/changelog/${id}`,
  getAllOvv: () => `/v1/ppcn/ovv/`,
  ppcnAvailableStatuses: () => `/v1/workflow/status`,
  getPpcnComments: (id: string) => `/v1/ppcn/${id}/comments`,
};

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
  geographic?: string;
}

const fsm_next_state = {
  PPCN_decision_step_DCC: [
    'PPCN_accepted_request_by_DCC',
    'PPCN_rejected_request_by_DCC',
    'PPCN_changes_requested_by_DCC',
  ],
  PPCN_evaluation_by_CA: ['PPCN_decision_step_CA'],
  PPCN_decision_step_CA: ['PPCN_accepted_request_by_CA', 'PPCN_rejected_request_by_CA'],
};

export interface ReportContext {
  comment: string;
  file: string | any;
}

@Injectable()
export class PpcnService {
  private pccnLevelId = new BehaviorSubject('');
  currentLevelId = this.pccnLevelId.asObservable();

  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3: S3Service,
  ) {}

  deletePpcn(uuid: string): Observable<{} | Object> {
    const url = routes.deletePpcn(uuid);
    // routes.deleteMitigationAction(uuid)
    return this.httpClient.delete(url, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'PPCN deleted correctly',
        };
        return response;
      }),
    );
  }

  updateCurrentGeographicalLevel(newGeographicalLevelId: string) {
    this.pccnLevelId.next(newGeographicalLevelId);
  }

  ppcn(lang: string): Observable<Ppcn[]> {
    return this.httpClient.get(routes.ppcns(lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  ppcnAll(lang: string): Observable<Ppcn[]> {
    return this.httpClient.get(routes.ppcnsAll(lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  reRoutePpcn(lang: string): Observable<Ppcn[]> {
    return this.ppcn(lang);
  }

  geographicLevel(lang: string): Observable<GeographicLevel[]> {
    return this.httpClient.get(routes.getGeographicLevel(lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  ovvFormData(): Observable<Ovv> {
    return this.httpClient.get(routes.getAllOvv(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  newPpcnFormData(levelId: string, lang: string): Observable<PpcnNewFormData> {
    return this.httpClient.get(routes.seededFormData(levelId, lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  subsectors(sector: string, lang: string): Observable<SubSector[]> {
    return this.httpClient.get(routes.subsectors(sector, lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  getPpcn(uuid: string, lang: string): Observable<Ppcn> {
    return this.httpClient.get(routes.getPpcn(uuid, lang), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  submitPpcnNewFile(context: any): Observable<Response> {
    const fileList = context.files;

    const formData: FormData = new FormData();
    formData.append('ppcn_form', context.ppcnCtrl);

    if (fileList.length > 0) {
      for (const file of fileList) {
        const fileToUpload = file.file.files[0];
        formData.append('files[]', fileToUpload, fileToUpload.name);
      }
      return this.httpClient.post(routes.submitNewFilePPCN(), formData, {}).pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'Files submitted correctly',
          };
          return response;
        }),
      );
    } else {
      // raise exception
    }
  }

  ppcnReviews(id: string): Observable<PpcnReview[]> {
    return this.httpClient.get(routes.ppcnReviews(id), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  getPpcnReviewStatuses(): Observable<PpcnNewFormData> {
    return this.httpClient.get(routes.ppcnAvailableStatuses(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  commonstatuses(ppcn: Ppcn): string[] {
    return fsm_next_state[ppcn.fsm_state];
  }

  mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
    return [
      { route: `ppcn/${uuid}/edit`, status: 'PPCN_changes_requested_by_DCC' },
      // implementing_INGEI_changes
    ];
  }

  getPpcnComments(id: string) {
    return this.httpClient.get(routes.getPpcnComments(id), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  submitNewPPCN(context: any) {
    return this.httpClient.post(routes.submitNewPpcn(), context, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          id: body.id,
          geographic: body.geographicLevel,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  submitUpdatedPPCN(id: string, context: any) {
    return this.httpClient.put(routes.submitUpdatePpcn(id), context, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          id: body.id,
          geographic: '',
          message: 'Form updated correctly',
        };
        return response;
      }),
    );
  }

  submitPPCN(
    state: number,
    context: any,
    savedPPCN: boolean,
    contactFormId: number = null,
    geiOrganizationId: number = null,
    geographicFormId: number = null,
    id: string = null,
  ) {
    const formData = this.buildPPCNForm(state, context, contactFormId, geographicFormId, geiOrganizationId);

    if (!savedPPCN) {
      return this.submitNewPPCN(formData);
    }

    return this.submitUpdatedPPCN(id, formData);
  }

  buildPPCNForm(
    state: number,
    context: any,
    contactFormId: number = null,
    geographicFormId: number = null,
    geiOrganizationId: number = null,
  ) {
    const formData = {};

    const functionToInvokeByIndex = [
      {
        name: '',
        function: '',
        concat: '',
      },
      {
        name: 'organization',
        function: 'buildOrganizationData',
        concat: '',
      },
      {
        name: 'organization_classification',
        function: 'buildOrganizationClassificationData',
        concat: '',
      },
      {
        name: 'organization_classification',
        function: 'buildReductionData',
        concat: 'reduction',
      },
      {
        name: 'organization_classification',
        function: 'buildCarbonOffset',
        concat: 'carbon_offset',
      },
      {
        name: 'gei_organization',
        function: 'buildGeiOrganizationData',
        concat: '',
      },
      {
        name: 'gas_removal',
        function: 'buildGasRemovalData',
        concat: '',
      },
      {
        name: 'gei_organization',
        function: 'buildGeiActivityData',
        concat: 'gei_activity_type',
      },
    ];

    for (let index = 0; index <= state; index++) {
      if (functionToInvokeByIndex[index].function !== '') {
        if (functionToInvokeByIndex[index].concat === '') {
          formData[functionToInvokeByIndex[index].name] = this[functionToInvokeByIndex[index].function](context);
        } else {
          formData[functionToInvokeByIndex[index].name][functionToInvokeByIndex[index].concat] =
            this[functionToInvokeByIndex[index].function](context);
        }
      }
    }

    if (contactFormId) {
      formData['organization']['contact']['id'] = String(contactFormId);
    }

    this.currentLevelId.subscribe((levelId) => (formData['geographic_level'] = levelId));
    formData['user'] = String(this.credentialsService.credentials.id);

    if (geographicFormId) {
      formData['geographic_level'] = String(geographicFormId);
    }

    if (geiOrganizationId) {
      if (formData['gei_organization']) {
        formData['gei_organization']['id'] = String(geiOrganizationId);
      }
    }

    return formData;
  }

  buildOrganizationData(context: any, contactFormId: number = null) {
    const organization = {};
    const contact = {};

    organization['name'] = context[0].nameCtrl;
    organization['representative_name'] = context[0].representativeNameCtrl;
    organization['representative_legal_identification'] = context[0].legalRepresentativeIdCtrl;
    organization['legal_identification'] = context[0].legalIdCtrl;
    organization['confidential'] = context[0].confidentialCtrl;
    organization['confidential_fields'] = context[0].confidentialValueCtrl;

    organization['phone_organization'] = context[0].telephoneCtrl;
    organization['postal_code'] = context[0].postalCodeCtrl;
    organization['fax'] = context[0].faxCtrl;
    organization['email_representative_legal'] = context[0].emailCtrl;
    organization['ciiu_code_list'] = [];

    for (const value of context[0].ciuuListCodeCtrl) {
      const element = {
        ciiu_code: value,
      };
      organization['ciiu_code_list'].push(element);
    }
    organization['address'] = context[0].addressCtrl;

    if (contactFormId) {
      contact['id'] = String(contactFormId);
    }
    contact['full_name'] = context[1].contactNameCtrl;
    contact['job_title'] = context[1].positionCtrl;
    contact['email'] = context[1].emailFormCtrl;
    contact['phone'] = context[1].phoneCtrl;

    organization['contact'] = contact;

    return organization;
  }

  buildOrganizationClassificationData(context: any) {
    const organization_classification = {};

    organization_classification['methodologies_complexity'] = context[2].complexityMethodologies;

    organization_classification['required_level'] = context[2].requiredCtrl;
    organization_classification['recognition_type'] = context[2].recognitionCtrl;
    organization_classification['emission_quantity'] = context[2].amountOfEmissions;
    organization_classification['buildings_number'] = context[2].numberofDacilities;
    organization_classification['data_inventory_quantity'] = context[2].amountInventoryData;

    return organization_classification;
  }

  buildReductionData(context: any) {
    const reductions: any[] = [];
    const validateListReduction = [7, 8, 9, 10];

    context[3].reductions.forEach((reduction: Object) => {
      const newReduction = {
        project: reduction['reductionProjectCtrl'],
        activity: reduction['reductionActivityCtrl'],
        detail_reduction: reduction['reductionDetailsCtrl'],
        emission: reduction['reducedEmissionsCtrl'],
        total_emission: reduction['totalEmissionsReduced'],
        investment: reduction['investmentReductionsValue'],
        investment_currency: reduction['investmentReductions'],
        total_investment: reduction['totalInvestmentReductionValue'],
        total_investment_currency: reduction['totalInvestmentReduction'],
      };
      if (reduction['id']) {
        newReduction['id'] = reduction['id'];
      }
      reductions.push(newReduction);
    });

    return validateListReduction.indexOf(context[2].recognitionCtrl) >= 0 ? reductions : null;
  }

  buildCarbonOffset(context: any) {
    const carbonOffsets: any = [];
    const validateListCompensation = [9, 10];

    context[4].compensations.forEach((carbonOffset: Object) => {
      const newCarbonOffset = {
        offset_scheme: carbonOffset['compensationScheme'],
        project_location: carbonOffset['projectLocation'],
        certificate_identification: carbonOffset['certificateNumber'],
        total_carbon_offset: carbonOffset['totalCompensation'],
        offset_cost: carbonOffset['compensationCostValue'],
        offset_cost_currency: carbonOffset['compensationCost'],
        period: carbonOffset['period'],
        total_offset_cost: carbonOffset['totalEmissionsOffsets'],
        total_offset_cost_currency: carbonOffset['totalCostCompensation'],
      };
      if (carbonOffset['id']) {
        newCarbonOffset['id'] = carbonOffset['id'];
      }
      carbonOffsets.push(newCarbonOffset);
    });

    return validateListCompensation.indexOf(context[2].recognitionCtrl) >= 0 ? carbonOffsets : null;
  }

  buildGeiOrganizationData(context: any, geiOrganizationId: number = null) {
    const geiOrganization = {};

    if (!context[5].ovvCtrl) {
      if (geiOrganizationId) {
        geiOrganization['id'] = String(geiOrganizationId);
      }
      geiOrganization['emission_ovv_date'] = this.datePipe.transform(
        context[5].implementationEmissionDateCtrl,
        'yyyy-MM-dd',
      );
      geiOrganization['base_year'] = context[5].baseYearCtrl;
      geiOrganization['report_year'] = context[5].reportYearCtrl;

      geiOrganization['scope'] = context[5].scope;
    } else {
      if (geiOrganizationId) {
        geiOrganization['id'] = String(geiOrganizationId);
      }

      geiOrganization['scope'] = context[5].scope;
      //geiOrganization["activity_type"] = context.formArray[5].activityCtrl;
      geiOrganization['ovv'] = context[5].ovvCtrl;
      geiOrganization['emission_ovv_date'] = this.datePipe.transform(
        context[5].implementationEmissionDateCtrl,
        'yyyy-MM-dd',
      );
      geiOrganization['base_year'] = context[5].baseYearCtrl;
      geiOrganization['report_year'] = context[5].reportYearCtrl;

      geiOrganization['organization_category'] = context.categoryTable;
      geiOrganization['gas_report'] = context.gasReportTable;
    }

    return geiOrganization;
  }

  buildGasRemovalData(context: any) {
    const gasRemovals: any[] = [];
    context[6].removals.forEach((removal: Object) => {
      const newRemoval = {
        removal_cost: removal['costRemovalInventoryCtrl'],
        removal_cost_currency: removal['costRemovalInventoryValueCtrl'],
        total: removal['totalremovalsCtrl'],
        removal_descriptions: removal['removalProjectDetailCtrl'],
      };
      gasRemovals.push(newRemoval);
    });
    return gasRemovals.length > 0 ? gasRemovals : null;
  }

  buildGeiActivityData(context: any) {
    const geiOrganization: any = [];

    if (context[7].activities) {
      context[7].activities.forEach((activity: any) => {
        const objectToPush = {
          activity_type: activity.activityCtrl,
          sub_sector: activity.subSectorCtrl,
          sector: activity.sectorCtrl,
        };
        if (activity['id']) {
          objectToPush['id'] = activity['id'];
        }
        geiOrganization.push(objectToPush);
      });
    }

    return geiOrganization;
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }
}
