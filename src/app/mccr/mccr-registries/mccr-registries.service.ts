import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { S3File, S3Service } from '@shared/s3.service';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { map } from 'rxjs/operators';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Ovv } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/ovv';
import { StatusRoutesMap } from '@shared/status-routes-map';

const routes = {
  seededFormData: () => `/v1/mccr/registries`,
  submitNewMccrRegistry: () => `/v1/mccr/`,
  submitUpdateMccrRegistry: (uuid: string) => `/v1/mccr/${uuid}`,
  mccrRegistries: () => `/v1/mccr/`,
  deleteMccrRegistry: (uuid: string) => `/v1/mccr/${uuid}`,
  getMccrRegistry: (uuid: string) => `/v1/mccr/${uuid}`,
  ovvs: () => `/v1/mccr/ovv`,
  patchOvv: (ovvId: string, mccrId: string) => `/v1/mccr/${mccrId}/ovv/${ovvId}`,
};

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
}

export interface SelectedOvv {
  ovvId: string;
}
@Injectable({
  providedIn: 'root',
})
export class MccrRegistriesService {
  private mccrRegistrySource = new BehaviorSubject(null);
  currentMccrRegistry = this.mccrRegistrySource.asObservable();

  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3: S3Service
  ) {}

  updateCurrentMccrRegistry(newMccrRegistry: MccrRegistry) {
    this.mccrRegistrySource.next(newMccrRegistry);
  }

  submitMccrRegistryNewForm(context: any): Observable<Response> {
    const fileList = context.files;
    const formData: FormData = new FormData();
    formData.append('mitigation', context.mitigationActionCtrl);
    formData.append('user', String(this.credentialsService.credentials.id));
    formData.append('user_type', String(1));
    formData.append('status', 'created');
    if (fileList.length > 0) {
      for (const file of fileList) {
        const fileToUpload = file.file.files[0];
        formData.append('files[]', fileToUpload, fileToUpload.name);
      }
      return this.httpClient.post(routes.submitNewMccrRegistry(), formData, {}).pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'Form submitted correctly',
          };
          return response;
        })
      );
    } else {
      // raise exception
    }
  }

  submitMitigationActionUpdateForm(context: any, uuid: string): Observable<Response> {
    context['user'] = String(this.credentialsService.credentials.id);
    context['user_type'] = String(1);
    return this.httpClient.put(routes.submitUpdateMccrRegistry(uuid), context, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  newMccrRegistryFormData(): Observable<MitigationAction[]> {
    return this.httpClient.get(routes.seededFormData(), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  mccrRegistries(): Observable<MccrRegistry[]> {
    return this.httpClient.get(routes.mccrRegistries(), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  getMccrRegistry(uuid: string): Observable<MccrRegistry> {
    return this.httpClient.get(routes.getMccrRegistry(uuid), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  deleteMccrRegistry(uuid: string): Observable<{} | Object> {
    const url = routes.deleteMccrRegistry(uuid);
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

  getOvvs(): Observable<Ovv[]> {
    return this.httpClient.get(routes.ovvs(), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  submitOvvSelector(context: any, mccrUuid: string): Observable<Response> {
    return this.httpClient.patch(routes.patchOvv(context.ovvCtrl, mccrUuid), {}, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

  mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
    return [
      {
        route: `mccr/registries/${uuid}/ovv`,
        status: 'mccr_ovv_assigned_first_review',
      },
      {
        route: `mccr/registries/${uuid}/ovv/proposal`,
        status: 'mccr_ovv_accept_assignation',
      },
      {
        route: `mccr/registries/${uuid}`,
        status: 'mccr_secretary_get_dp_information',
      },
      {
        route: `mccr/registries/${uuid}`,
        status: 'mccr_in_exec_committee_evaluation',
      },
      {
        route: `mccr/registries/${uuid}`,
        status: 'mccr_secretary_get_report_information',
      },
      {
        route: `mccr/registries/${uuid}`,
        status: 'mccr_ucc_in_exec_committee_evaluation',
      },
      // mccr_ucc_in_exec_committee_evaluation
      {
        route: `mccr/registries/${uuid}/monitoring/proposal/new`,
        status: 'mccr_upload_report_sinamecc',
      },
      {
        route: `mccr/registries/${uuid}/monitoring/verification/proposal/new`,
        status: 'mccr_ovv_upload_evaluation_monitoring',
      },
      // {route: `mitigation/actions/${uuid}/edit`, status: 'changes_requested_by_DCC'},
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
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
