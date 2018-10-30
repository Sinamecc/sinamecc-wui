import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MitigationActionReview } from '@app/mitigation-actions/mitigation-action-review';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { MitigationActionReviewNewFormData } from '@app/mitigation-actions/mitigation-action-review-new-form-data';
import { StatusRoutesMap } from '@app/mitigation-actions/status-routes-map';
import { S3File, S3Service } from '@app/core/s3.service';

const routes = {
  seededFormData: (lang: string, registration_type: string) => `/v1/mitigations/form/${lang}/${registration_type}`,
  submitNewMitigationAction: () => `/v1/mitigations/`,
  submitUpdateMitigationAction: (uuid:string) => `/v1/mitigations/${uuid}`,
  mitigationActions: (lang: string) => `/v1/mitigations/${lang}`,
  mitigationActionReviews: (uuid: string) =>  `/v1/mitigations/changelog/${uuid}`,
  deleteMitigationAction: (uuid: string) => `/v1/mitigations/${uuid}`,
  getMitigationAction: (uuid: string, lang: string) => `/v1/mitigations/${lang}/${uuid}`,
  mitigationActionAvailableStatuses: () => `/v1/workflow/status`,
  submitMitigationActionReview: (uuid: string) => `/v1/mitigations/${uuid}`,
  submitNewHarmonizationForMitigation: () => `/v1/mitigations/harmonization/ingei/`

};

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;

}

const fsm_next_state = {
  "decision_step_DCC":['registering', 'rejected_by_DCC', 'changes_requested_by_DCC'],
  "submit_INGEI_changes_proposal_evaluation_result": ["INGEI_changes_proposal_changes_requested_by_DCC_IMN", 
                                                      "INGEI_changes_proposal_rejected_by_DCC_IMN",
                                                      "INGEI_changes_proposal_accepted_by_DCC_IMN"],
  "submit_INGEI_harmonization_required":['INGEI_harmonization_required', 'submitted_SINAMECC_conceptual_proposal_integration'],
  "INGEI_harmonization_required": ['updating_INGEI_changes_proposal', 'submitted_SINAMECC_conceptual_proposal_integration']
}

export interface ReportContext {
  comment: string;
  file: string | any;
}

@Injectable()
export class MitigationActionsService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3:S3Service) {

  }

  submitMitigationActionNewForm(context: any, registrationTypeId:string): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let formData: FormData = this.buildFormData(context, registrationTypeId);
    return this.httpClient
    .post(routes.submitNewMitigationAction(), formData, httpOptions)
    .pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          id: body.id,
          message: 'Form submitted correctly'
        };
        return response;
      })
    );
    
  }

  submitMitigationActionUpdateForm(context: any, 
                                   uuid: string, 
                                   registrationTypeId:string,
                                   contactFormId: number, 
                                   progressIndicatorFormId: number, 
                                   financeFormId: number,
                                   locationFormId: number): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let formData: FormData = this.buildFormData(context, registrationTypeId, contactFormId, progressIndicatorFormId, financeFormId, locationFormId);
    return this.httpClient
    .put(routes.submitUpdateMitigationAction(uuid), formData, httpOptions)
    .pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly'
        };
        return response;
      })
    );
  }

  

  newMitigationActionFormData(language:string, registration_type:string): Observable < MitigationActionNewFormData > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .get(routes.seededFormData(language, registration_type), httpOptions) 
    .pipe(
      map((body: any) => {
        return body;
      })
    );

  }

  mitigationActions(language:string): Observable < MitigationAction[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.mitigationActions(language), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }


  mitigationActionReviews(uuid: string) : Observable < MitigationActionReview[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    return this.httpClient
    .get(routes.mitigationActionReviews(uuid), httpOptions) 
    .pipe(
      map((body: any) => {
        return body;
      })
    );


  }


  getMitigationAction(uuid: string, lang: string): Observable <MitigationAction> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.getMitigationAction(uuid, lang), httpOptions) 
      .pipe(
        map((body: any) => {
          console.log('MA', body);
          return body;
        })
      );
  }

  deleteMitigationAction(uuid: string): Observable <{} | Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const url = routes.deleteMitigationAction(uuid);
    // routes.deleteMitigationAction(uuid)
    return this.httpClient
      .delete(url, httpOptions) 
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'Mitigation Action deleted correctly'
          };
          return response;
        })
      );

  }

  getMitigationActionReviewStatuses(): Observable < MitigationActionReviewNewFormData > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .get(routes.mitigationActionAvailableStatuses(), httpOptions) 
    .pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  submitNewMitigationActionReviewForm(context: any, uuid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    context['user'] = this.authenticationService.credentials.id;
    const url = routes.submitMitigationActionReview(uuid);
    return this.httpClient
    .patch(url, context, httpOptions)
    .pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly'
        };
        return response;
      })
    );
  }

  commonStatusses(mitigationAction:MitigationAction): string[] {
    return fsm_next_state[mitigationAction.fsm_state];
  }

  mapRoutesStatuses(uuid:string): StatusRoutesMap[] {
    return [
      {route: `mitigation/actions/${uuid}/edit`, status: 'changes_requested_by_DCC'},
      {route: `mitigation/actions/${uuid}/harmonization/integration`, status: 'updating_INGEI_changes_proposal'},
      {route: `mitigation/actions/${uuid}/harmonization/integration`, status: 'updating_INGEI_changes_proposal_by_request_of_DCC_IMN'},
      {route: `mitigation/actions/${uuid}/conceptual/integration`, status: 'implementing_INGEI_changes'},
      // implementing_INGEI_changes
    ];
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  private buildFormData(context: any, 
                        registrationFormId:string,
                        contactFormId:number = null,
                        progressIndicatorFormId:number = null,
                        financeFormId:number = null,
                        locationFormId:number = null,) {
    let formData:FormData = new FormData();
    if(contactFormId) {
      formData.append('contact[id]', String(contactFormId));
    }
    formData.append('contact[full_name]', context.formArray[1].contactNameCtrl);
    formData.append('contact[job_title]', context.formArray[1].positionCtrl);
    formData.append('contact[email]', context.formArray[1].emailFormCtrl);
    formData.append('contact[phone]', context.formArray[1].phoneCtrl);
    if(progressIndicatorFormId) {
      formData.append('progress_indicator[id]', String(progressIndicatorFormId));
    }
    formData.append('progress_indicator[name]', context.formArray[3].progressIndicatorNameCtrl);
    formData.append('progress_indicator[type]', context.formArray[3].progressIndicatorTypeCtrl);
    formData.append('progress_indicator[unit]', context.formArray[3].progressIndicatorUnitCtrl);
    formData.append('progress_indicator[start_date]', this.datePipe.transform(context.formArray[3].progressIndicatorInitialYearCtrl, 'yyyy-MM-dd'));
    if(locationFormId) {
      formData.append('location[id]', String(locationFormId));
    }
    formData.append('location[geographical_site]', context.formArray[7].locationNameCtrl);
    formData.append('location[is_gis_annexed]', context.formArray[7].gisAnnexedCtrl);
    if(financeFormId) {
      formData.append('finance[id]', String(financeFormId));
    }
    formData.append('finance[finance_source_type]', context.formArray[4].financingStatusCtrl);
    formData.append('finance[source]', context.formArray[4].financingSourceCtrl);

    formData.append('strategy_name', context.formArray[0].programCtrl);
    formData.append('name',  context.formArray[0].nameCtrl);
    formData.append('purpose', context.formArray[2].actionObjectiveCtrl);
    formData.append('quantitative_purpose', context.formArray[2].quantitativeObjectiveCtrl);
    formData.append('gas_inventory', context.formArray[4].gasInventoryCtrl);
    formData.append('emissions_source', context.formArray[8].emissionSourceCtrl);
    formData.append('carbon_sinks', context.formArray[8].carbonSinksCtrl);
    formData.append('impact_plan', context.formArray[8].mitigationActionImpactCtrl);
    formData.append('impact', context.formArray[8].emissionImpactCtrl);
    formData.append('bibliographic_sources', context.formArray[8].bibliographicalSourcesCtrl);
    formData.append('is_international', context.formArray[8].internationalParticipationCtrl);
    formData.append('international_participation', context.formArray[8].internationalParticipationDetailCtrl);
    formData.append('sustainability', context.formArray[8].sustainabilityObjectivesCtrl);
    formData.append('registration_type', registrationFormId);
    formData.append('start_date', this.datePipe.transform(context.formArray[2].implementationInitialDateCtrl, 'yyyy-MM-dd'));
    formData.append('end_date', this.datePipe.transform(context.formArray[2].implementationEndDateCtrl, 'yyyy-MM-dd'));
    formData.append('status', context.formArray[2].actionStatusCtrl);
    formData.append('institution', context.formArray[0].entityCtrl);
    formData.append('question_ucc', context.formArray[0].uccCtrl);
    formData.append('question_ovv', context.formArray[0].ovvCtrl);
    formData.append('ingei_compliances', context.formArray[5].ingeiComplianceCtrl ? context.formArray[5].ingeiComplianceCtrl.join() : '');
    formData.append('geographic_scale', context.formArray[6].geographicScaleCtrl);
    formData.append('user', String(this.authenticationService.credentials.id)); // change to user id from current user
    return formData;

  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

}
