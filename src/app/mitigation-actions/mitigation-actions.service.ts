import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationAction } from './mitigation-action';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { DatePipe } from '@angular/common';

const routes = {
  seededFormData: () => `/v1/mitigations/form`,
  submitNewMitigationAction: () => `/v1/mitigations/`
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
    console.log(this.datePipe.transform(context.formArray[3].progressIndicatorInitialYearCtrl, 'yyyy-MM-dd'));

    let formData: FormData = new FormData();

    formData.append('contact[full_name]', context.formArray[1].contactNameCtrl);
    formData.append('contact[job_title]', context.formArray[1].positionCtrl);
    formData.append('contact[email]', context.formArray[1].emailFormCtrl);
    formData.append('contact[phone]', context.formArray[1].phoneCtrl);

    formData.append('progress_indicator[type]', context.formArray[3].progressIndicatorTypeCtrl);
    formData.append('progress_indicator[unit]', context.formArray[3].progressIndicatorUnitCtrl);
    formData.append('progress_indicator[start_date]', this.datePipe.transform(context.formArray[3].progressIndicatorInitialYearCtrl, 'yyyy-MM-dd'));

    formData.append('location[geographical_site]', context.formArray[7].locationNameCtrl);
    formData.append('location[is_gis_annexed]', context.formArray[7].gisAnnexedCtrl);

    formData.append('strategy_name', context.formArray[0].programCtrl);
    formData.append('name',  context.formArray[0].nameCtrl);
    formData.append('purpose', context.formArray[2].actionObjectiveCtrl);
    formData.append('quantitative_purpose', context.formArray[2].quantitativeObjectiveCtrl);
    formData.append('gas_inventory', context.formArray[4].gasInventoryCtrl);
    formData.append('emissions_source', context.formArray[8].emissionSourceCtrl);
    formData.append('carbon_sinks', context.formArray[8].carbonSinksCtrl);
    formData.append('impact_plan', context.formArray[8].mitigationActionImpactCtrl);
    formData.append('impact', context.formArray[8].emitionImpactCtrl);
    formData.append('bibliographic_sources', context.formArray[8].bibliographicalSourcesCtrl);
    formData.append('is_international', context.formArray[8].internationalParticipationCtrl);
    formData.append('international_participation', context.formArray[8].internationalParticipationDetailCtrl);
    formData.append('sustainability', context.formArray[8].sustainabilityObjectivesCtrl);
    formData.append('registration_type', '1');
    formData.append('start_date', this.datePipe.transform(context.formArray[2].implementationInitialDateCtrl, 'yyyy-MM-dd'));
    formData.append('end_date', this.datePipe.transform(context.formArray[2].implementationEndDateCtrl, 'yyyy-MM-dd'));
    formData.append('status', context.formArray[2].actionStatusCtrl);
    formData.append('institution', context.formArray[0].entityCtrl);
    formData.append('finance', context.formArray[4].financingStatusCtrl);
    formData.append('ingei_compliance', context.formArray[5].afoluIngeiCtrl + context.formArray[5].processIngeiCtrl + context.formArray[5].wasteIngeiCtrl);
    formData.append('geographic_scale', context.formArray[6].geographicScaleCtrl);
    formData.append('user', '1'); // change to user id from current user

    return this.httpClient
    .post(routes.submitNewMitigationAction(), formData, httpOptions)
    .pipe(
      map((body: any) => {
        console.log(body);
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly'
        };
        return response;
      })
    );
    

    //formData.append('file', file, file.name);
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
        console.log(body);
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

    return of([
      { name: 'Mitigation Action 1', created: '2018-03-23 14:30:50.501041-06', updated: '2018-03-23 14:31:34.286086-06'},
      { name: 'Mitigation Action 2', created: '2018-03-23 14:30:50.501041-06', updated: '2018-03-23 14:31:34.286086-06'},
      { name: 'Mitigation Action 3', created: '2018-03-23 14:30:50.501041-06', updated: '2018-03-23 14:31:34.286086-06'},
      { name: 'Mitigation Action 4', created: '2018-03-23 14:30:50.501041-06', updated: '2018-03-23 14:31:34.286086-06'},
      { name: 'Mitigation Action 5', created: '2018-03-23 14:30:50.501041-06', updated: '2018-03-23 14:31:34.286086-06'},
    ]);

  }

}
