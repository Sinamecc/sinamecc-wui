import { Observable, of, throwError } from 'rxjs';
import { Response } from '@app/mccr/mccr-poc/mccr-poc.service';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { StatusRoutesMap } from '@shared/status-routes-map';
import { S3File } from '@shared/s3.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as _moment from 'moment';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { Ovv } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/ovv';

const moment = _moment;

export class MockMccrRegistriesService {
  s3: MockS3Service;
  mitigationActionMockService: MockMitigationActionsService;
  someMccrRegistries: MccrRegistry[];
  someMitigationActions: MitigationAction[];
  currentMccrRegistry: Observable<MccrRegistry>;

  constructor() {
    this.someMccrRegistries = [
      {
        mitigation: 'Some mitigation 1',
        id: '1',
        files: ['', ''],
        workflow_step_files: ['', ''],
        created: '01/01/1990',
        updated: '01/01/1990',
        next_state: {
          required_comments: true,
          states: ['Approved by DCC', 'Rejected by DCC'],
        },
        fsm_state: 'Approved',
      },
      {
        mitigation: 'Some mitigation 2',
        id: '2',
        files: ['', ''],
        workflow_step_files: ['', ''],
        created: '01/01/1990',
        updated: '01/01/1990',
        next_state: {
          required_comments: true,
          states: ['Approved by DCC', 'Rejected by DCC'],
        },
        fsm_state: 'Approved',
      },
    ];
    this.currentMccrRegistry = of(this.someMccrRegistries[0]);
  }

  updateCurrentMccrRegistry(newMccrRegistry: MccrRegistry) {
    return true;
  }

  submitMccrRegistryNewForm(context: any): Observable<Response> {
    const response = {
      statusCode: 200,
      message: 'Form submitted correctly',
    };
    return of(response);
  }

  submitMitigationActionUpdateForm(context: any, uuid: string): Observable<Response> {
    return of({
      statusCode: 200,
      message: 'Form submitted correctly',
      id: '001',
    });
  }

  newMccrRegistryFormData(): Observable<MitigationAction[]> {
    return of(this.someMitigationActions);
  }

  mccrRegistries(): Observable<MccrRegistry[]> {
    return of(this.someMccrRegistries);
  }

  getMccrRegistry(uuid: string): Observable<MccrRegistry> {
    return of(this.someMccrRegistries.find((mccr) => mccr.id === uuid));
  }

  deleteMccrRegistry(uuid: string): Observable<{} | Object> {
    return of({
      statusCode: 200,
      message: 'MCCR Registry Deleted',
      id: '001',
    });
  }

  getOvvs(): Observable<Ovv[]> {
    return of([
      {
        email: 'ovv@me.com',
        phone: '40008000',
        id: Math.random().toString(36).substring(30),
      },
      {
        email: 'ovv2@me.com',
        phone: '40008002',
        id: Math.random().toString(36).substring(30),
      },
      {
        email: 'ovv3@me.com',
        phone: '40008003',
        id: Math.random().toString(36).substring(30),
      },
    ]);
  }

  submitOvvSelector(context: any, mccrUuid: string): Observable<Response> {
    return of({
      statusCode: 200,
      message: 'OVV Selector Created',
      id: '001',
    });
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
      {
        route: `mccr/registries/${uuid}/monitoring/proposal/new`,
        status: 'mccr_upload_report_sinamecc',
      },
      {
        route: `mccr/registries/${uuid}/monitoring/verification/proposal/new`,
        status: 'mccr_ovv_upload_evaluation_monitoring',
      },
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
