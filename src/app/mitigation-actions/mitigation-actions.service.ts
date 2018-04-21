import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationAction } from './mitigation-action';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

const routes = {
  seededFormData: () => `/v1/mitigations/form`,
  submitNewMitigationAction: () => `/v1/mitigations/`,
  submitUpdateMitigationAction: (uuid:string) => `/v1/mitigations/${uuid}`,
  mitigationActions: () => `/v1/mitigations/`,
  deleteMitigationAction: (uuid: string) => `/v1/mitigations/${uuid}`,
  getMitigationAction: (uuid: string) => `/v1/mitigations/${uuid}`

};


export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;

}
@Injectable()
export class MitigationActionsService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe) {

  }

  submitMitigationActionNewForm(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let formData: FormData = this.buildFormData(context);
    return this.httpClient
    .post(routes.submitNewMitigationAction(), formData, httpOptions)
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

  submitMitigationActionUpdateForm(context: any, uuid: string, 
                                   contactFormId: number, 
                                   progressIndicatorFormId: number, 
                                   financeFormId: number,
                                   locationFormId: number): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let formData: FormData = this.buildFormData(context, contactFormId, progressIndicatorFormId, financeFormId, locationFormId);
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

  

  newMitigationActionFormData(): Observable < MitigationActionNewFormData > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .get(routes.seededFormData(), httpOptions) 
    .pipe(
      map((body: any) => {
        return body;
      })
    );

  }

  mitigationActions(): Observable < MitigationAction[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    return this.httpClient
      .get(routes.mitigationActions(), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

  }

  getMitigationAction(uuid: string): Observable <MitigationAction> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };


    return this.httpClient
      .get(routes.getMitigationAction(uuid), httpOptions) 
      .pipe(
        map((body: any) => {
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

  private buildFormData(context: any, contactFormId:number = null,
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
    formData.append('finance[name]', context.formArray[4].financingStatusCtrl);
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
    formData.append('registration_type', '1');
    formData.append('start_date', this.datePipe.transform(context.formArray[2].implementationInitialDateCtrl, 'yyyy-MM-dd'));
    formData.append('end_date', this.datePipe.transform(context.formArray[2].implementationEndDateCtrl, 'yyyy-MM-dd'));
    formData.append('status', context.formArray[2].actionStatusCtrl);
    formData.append('institution', context.formArray[0].entityCtrl);
    formData.append('ingei_compliances', context.formArray[5].ingeiComplianceCtrl ? context.formArray[5].ingeiComplianceCtrl.join() : '');
    formData.append('geographic_scale', context.formArray[6].geographicScaleCtrl);
    formData.append('user', String(this.authenticationService.credentials.id)); // change to user id from current user
    return formData;

  }
}
