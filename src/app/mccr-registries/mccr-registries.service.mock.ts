import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Response } from './mccr-registries.service';
import { MccrRegistry } from './mccr-registry';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MockS3Service } from '@app/core/s3.service.mock';
import { StatusRoutesMap } from '@app/shared/status-routes-map';
import { S3File, S3Service } from '@app/core/s3.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as _moment from 'moment';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Ovv } from '@app/mccr-registries/mccr-registries-ovv-selector/ovv';
import { Inject } from '@angular/core';

const moment = _moment;

export class MockMccrRegistriesService {
  s3: MockS3Service;
  mitigationActionMockService: MockMitigationActionsService;
  someMccrRegistries: MccrRegistry[];
  someMitigationActions: MitigationAction[];
  constructor(@Inject(MockMitigationActionsService) mitigationActionMockService: MockMitigationActionsService, 
              @Inject(MockS3Service) s3: MockS3Service) {
    // @Inject(OtherService)
    this.someMccrRegistries = [
      {
        mitigation: 'Some mitigation 1',
        id: Math.random().toString(36).substring(30),
        files: ['', ''],
        workflow_step_files: ['', ''],
        created: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
          .format('MM/DD/YYYY'),
        updated: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
          .format('MM/DD/YYYY'),
        next_state: {
          required_comments: true,
          states: ['Approved by DCC', 'Rejected by DCC']
        },
        fsm_state: 'Approved'
      },
      {
        mitigation: 'Some mitigation 2',
        id: Math.random().toString(36).substring(30),
        files: ['', ''],
        workflow_step_files: ['', ''],
        created: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
          .format('MM/DD/YYYY'),
        updated: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
          .format('MM/DD/YYYY'),
        next_state: {
          required_comments: true,
          states: ['Approved by DCC', 'Rejected by DCC']
        },
        fsm_state: 'Approved'
      }
    ];
    this.someMitigationActions = mitigationActionMockService.someMitigationActions;
    this.s3 = s3;
  }

  updateCurrentMccrRegistry(newMccrRegistry: MccrRegistry) {
    //   this.mccrRegistrySource.next(newMccrRegistry)
    return true;
  }

  submitMccrRegistryNewForm(context: any): Observable<Response> {
    const response = {
      statusCode: 200,
      message: 'Form submitted correctly'
    };
    return of(response);
  }

  submitMitigationActionUpdateForm(context: any, uuid: string): Observable<Response> {
    return of({
      statusCode: 200,
      message: 'Form submitted correctly',
      id: '001'
    });
  }

  newMccrRegistryFormData(): Observable<MitigationAction[]> {
    return of(this.someMitigationActions);
  }

  mccrRegistries(): Observable<MccrRegistry[]> {
    return of(this.someMccrRegistries);
  }

  getMccrRegistry(uuid: string): Observable<MccrRegistry> {
    return of(this.someMccrRegistries.find((mccr) => mccr.id == uuid));
  }

  deleteMccrRegistry(uuid: string): Observable<{} | Object> {
    return of({
      statusCode: 200,
      message: 'MCCR Registry Deleted',
      id: '001'
    });
  }

  getOvvs(): Observable<Ovv[]> {
    return of([
      {
        email: 'ovv@me.com',
        phone: '40008000',
        id: Math.random().toString(36).substring(30)
      },
      {
        email: 'ovv2@me.com',
        phone: '40008002',
        id: Math.random().toString(36).substring(30)
      },
      {
        email: 'ovv3@me.com',
        phone: '40008003',
        id: Math.random().toString(36).substring(30)
      }
    ])

  }

  submitOvvSelector(context: any, mccrUuid: string): Observable<Response> {
    return of({
      statusCode: 200,
      message: 'OVV Selector Created',
      id: '001'
    });
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

  mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
    return [
      { route: `mccr/registries/${uuid}/ovv`, status: 'mccr_ovv_assigned_first_review' },
      { route: `mccr/registries/${uuid}/ovv/proposal`, status: 'mccr_ovv_accept_assignation' },
      { route: `mccr/registries/${uuid}`, status: 'mccr_secretary_get_dp_information' },
      { route: `mccr/registries/${uuid}`, status: 'mccr_in_exec_committee_evaluation' },
      { route: `mccr/registries/${uuid}`, status: 'mccr_secretary_get_report_information' },
      { route: `mccr/registries/${uuid}`, status: 'mccr_ucc_in_exec_committee_evaluation' },
      // mccr_ucc_in_exec_committee_evaluation
      { route: `mccr/registries/${uuid}/monitoring/proposal/new`, status: 'mccr_upload_report_sinamecc' },
      { route: `mccr/registries/${uuid}/monitoring/verification/proposal/new`, status: 'mccr_ovv_upload_evaluation_monitoring' },
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
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };
}