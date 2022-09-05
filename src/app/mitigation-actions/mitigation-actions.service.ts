import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MitigationAction, Indicator } from '@app/mitigation-actions/mitigation-action';
import { MitigationActionReview } from '@app/mitigation-actions/mitigation-action-review';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationActionReviewNewFormData } from '@app/mitigation-actions/mitigation-action-review-new-form-data';
import { BehaviorSubject } from 'rxjs';
import { StatusRoutesMap } from '@shared/status-routes-map';
import { S3File, S3Service } from '@shared/s3.service';
import { CredentialsService } from '@app/auth';

const routes = {
  seededFormData: (lang: string, registration_type: string) => `/v1/mitigations/form/${lang}/${registration_type}`,
  submitNewMitigationAction: (id: string = '') => `/v1/mitigation-action/${id}`,
  submitUpdateMitigationAction: (uuid: string, lang: string) => `/v1/mitigations/${lang}/${uuid}`,
  mitigationActions: (lang: string) => `/v1/mitigation-action/`,
  mitigationActionReviews: (uuid: string) => `/v1/mitigation-action/${uuid}/change-log/`,
  deleteMitigationAction: (uuid: string) => `/v1/mitigation-action/${uuid}`,
  getMitigationAction: (uuid: string, lang: string) => `/v1/mitigation-action/${uuid}/`,
  mitigationActionAvailableStatuses: () => `/v1/workflow/status`,
  submitMitigationActionReview: (uuid: string) => `/v1/mitigations/${uuid}`,
  submitNewHarmonizationForMitigation: () => `/v1/mitigations/harmonization/ingei/`,
  getIndicator: (code: string) => `/v1/mitigation-action/${code}/indicator/`,
  getCatalogs: (id: string, parentCatalog: string, catalog: string) =>
    `/v1/mitigation-action/data/${parentCatalog}/${id}/${catalog}/`,
  getComments: (id: string = '') => `/v1/mitigation-action/${id}/comments/`,
  loadSubTopics: (id: string) => `/v1/mitigation-action/data/topics/${id}/sub-topics/`,
};

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
}

export interface ReportContext {
  comment: string;
  file: string | any;
}

@Injectable()
export class MitigationActionsService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient, private s3: S3Service) {}

  private mitigationActionSource = new BehaviorSubject(null);
  currentMitigationAction = this.mitigationActionSource.asObservable();

  updateCurrentMitigationAction(newMitigationAction: MitigationAction) {
    this.mitigationActionSource.next(newMitigationAction);
  }

  loadCatalogs(id: string, parentCatalog: string, catalog: string) {
    return this.httpClient.get(routes.getCatalogs(id, parentCatalog, catalog), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  getComments(id: string) {
    return this.httpClient.get(routes.getComments(id)).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  submitMitigationActionNewForm(context: any): Observable<Response> {
    return this.httpClient.post(routes.submitNewMitigationAction(), context, {}).pipe(
      map((body: any) => {
        this.updateCurrentMitigationAction(body);
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  loadSubTopics(id: string) {
    return this.httpClient.get(routes.loadSubTopics(id)).pipe(
      map((body: any[]) => {
        return body;
      })
    );
  }

  submitMitigationActionUpdateForm(context: any, uuid: string): Observable<Response> {
    return this.httpClient.put(routes.submitNewMitigationAction(uuid + '/'), context, {}).pipe(
      map((body: any) => {
        this.updateCurrentMitigationAction(body);
        const response = {
          statusCode: 200,
          id: body.id,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  newMitigationActionFormData(language: string, registration_type: string): Observable<MitigationActionNewFormData> {
    return this.httpClient.get(routes.seededFormData(language, registration_type), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  mitigationActions(language: string): Observable<MitigationAction[]> {
    return this.httpClient.get(routes.mitigationActions(language), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  mitigationActionReviews(uuid: string): Observable<MitigationActionReview[]> {
    return this.httpClient.get(routes.mitigationActionReviews(uuid), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  getMitigationActionIndicators(id: string) {
    return this.httpClient.get(routes.getIndicator(id), {}).pipe(
      map((body: Indicator[]) => {
        return body;
      })
    );
  }

  getMitigationAction(uuid: string, lang: string): Observable<MitigationAction> {
    return this.httpClient.get(routes.getMitigationAction(uuid, lang), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  deleteMitigationAction(uuid: string): Observable<{} | Object> {
    const url = routes.deleteMitigationAction(uuid);
    // routes.deleteMitigationAction(uuid)
    return this.httpClient.delete(url, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Mitigation Action deleted correctly',
        };
        return response;
      })
    );
  }

  getMitigationActionReviewStatuses(): Observable<MitigationActionReviewNewFormData> {
    return this.httpClient.get(routes.mitigationActionAvailableStatuses(), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  submitNewMitigationActionReviewForm(context: any, uuid: string) {
    context['user'] = this.credentialsService.credentials.id;
    const url = routes.submitMitigationActionReview(uuid);
    return this.httpClient.patch(url, context, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
    return [
      {
        route: `mitigation/actions/${uuid}/edit`,
        status: 'changes_requested_by_DCC',
      },
      {
        route: `mitigation/actions/${uuid}/harmonization/integration`,
        status: 'updating_INGEI_changes_proposal',
      },
      {
        route: `mitigation/actions/${uuid}/harmonization/integration`,
        status: 'updating_INGEI_changes_proposal_by_request_of_DCC_IMN',
      },
      {
        route: `mitigation/actions/${uuid}/conceptual/integration`,
        status: 'implementing_INGEI_changes',
      },
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
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    throw new Error('Something bad happened; please try again later.');
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }
}
