import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { PpcnNewFormData, Ovv, GeiOrganization } from '@app/ppcn/ppcn-new-form-data';
import { PpcnReview } from '@app/ppcn/ppcn-review';
import { S3File } from '@shared/s3.service';
import { StatusRoutesMap } from '@app/ppcn/status-routes-map';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import * as _moment from 'moment';
import { Organization } from './interfaces/organization';
import { SubSector } from './interfaces/subSector';
import { GeographicLevel } from './interfaces/geographicLevel';
const moment = _moment;

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

export class MockPpcnService {
  s3: MockS3Service;
  oneOrganization: Organization;
  geiOrganization: GeiOrganization;
  somePpcnRegistries: Ppcn[];
  currentLevelId: Observable<string>;
  ppcnNewFormData: PpcnNewFormData;

  constructor(@Inject(MockS3Service) s3: MockS3Service) {
    this.s3 = s3;
    this.oneOrganization = {
      id: 1,
      name: 'MINAE',
      legal_identification: 'some legal id',
      representative_legal_identification: '123456789',
      confidential: 'Si',
      confidential_fields: '',
      representative_name: 'Some rep',
      phone_organization: '22334455',
      postal_code: '10311',
      fax: '22334400',
      ciiu_code: [{ name: 'Some data code' }, { name: 'Some data code 2' }],
      address: 'Some address',
      contact: {
        full_name: 'Carl Michael',
        email: 'job@minae.com',
        job_title: 'Manager',
        phone: '88990066',
      },
    };
    this.somePpcnRegistries = [
      {
        id: '1',
        geographic_level: {
          id: 1,
          level: 'regional',
        },
        organization_classification: {
          emission_quantity: '1000',
          buildings_number: '1000',
          required_level: {
            id: 1,
            level_type: 'Some level',
          },
          data_inventory_quantity: '1000',
          recognition_type: {
            id: 1,
            recognition_type: 'Some recognition',
          },
          reduction: null,
          carbon_offset: null,
        },
        organization: this.oneOrganization,
        contact: {
          full_name: 'Carl Michael',
          email: 'job@minae.com',
          job_title: 'Manager',
          phone: '88990066',
        },
        base_year: '2001',
        ovv: [
          {
            id: 1,
            email: 'ovv1@minae.com',
            phone: '22440077',
            name: 'Random OVV 1',
          },
          {
            id: 2,
            email: 'ovv2@minae.com',
            phone: '22440088',
            name: 'Random OVV 8',
          },
        ],
        gei_organization: {
          id: 1,
          activity_type: 'CO2 Control',
          ovv: {
            id: 1,
            email: 'ovv10@minae.com',
            phone: '22445077',
            name: 'Random OVV 10',
          },
          emission_ovv_date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format(
            'MM/DD/YYYY'
          ),
          report_year: '1998',
          base_year: '1991',
          gei_activity_types: [
            {
              id: 1,
              sector: {
                id: 1,
                sector: 'Guanacaste',
              },
              sub_sector: {
                id: 1,
                name: 'Liberia',
                sector: {
                  id: 1,
                  sector: 'Guanacaste',
                },
              },
              activity_type: 'Farming',
            },
          ],
        },
        fsm_state: 'submitted',
        next_state: {
          states: ['DCC approved', 'DCC rejected'],
          required_comments: false,
        },
        ppcn_files: [
          { name: '', file: '' },
          { name: '', file: '' },
        ],
        gas_removal: [
          {
            id: '1',
            ppcn: 1,
            removal_cost: '100',
            removal_cost_currency: 'USD',
            removal_descriptions: 'Some description',
            total: '1000',
          },
        ],
      },
      {
        id: '2',
        geographic_level: {
          id: 2,
          level: 'national',
        },
        organization_classification: {
          emission_quantity: '1000',
          buildings_number: '1000',
          required_level: {
            id: 1,
            level_type: 'Some level',
          },
          data_inventory_quantity: '1000',
          recognition_type: {
            id: 1,
            recognition_type: 'Some recognition',
          },
          reduction: null,
          carbon_offset: null,
        },
        organization: {
          id: 1,
          name: 'ICE',
          legal_identification: 'some legal id',
          representative_legal_identification: '987654321',
          confidential: 'No',
          confidential_fields: '',
          representative_name: 'Some rep',
          phone_organization: '22337755',
          postal_code: '10312',
          fax: '22334400',
          ciiu_code: [{ name: 'Some data code' }, { name: 'Some data code 2' }],
          address: 'Some address',
          contact: {
            full_name: 'Michal Johanssen',
            email: 'job@ice.com',
            job_title: 'Geographical Manager',
            phone: '88992066',
          },
        },
        contact: {
          full_name: 'Michal Johanssen',
          email: 'job@ice.com',
          job_title: 'Geographical Manager',
          phone: '88992066',
        },
        base_year: '1988',
        ovv: [
          {
            id: 1,
            email: 'ovv1@ice.com',
            phone: '22440077',
            name: 'Random OVV 1',
          },
          {
            id: 2,
            email: 'ovv2@ice.com',
            phone: '22440088',
            name: 'Random OVV 8',
          },
        ],
        gei_organization: {
          id: 1,
          activity_type: 'Heat Control',
          ovv: {
            id: 1,
            email: 'ovv10@ice.com',
            phone: '22445077',
            name: 'Random OVV 10',
          },
          emission_ovv_date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format(
            'MM/DD/YYYY'
          ),
          report_year: '2010',
          base_year: '2015',
          gei_activity_types: [
            {
              id: 1,
              sector: {
                id: 1,
                sector: 'Alajuela',
              },
              sub_sector: {
                id: 1,
                name: 'San Carlos',
                sector: {
                  id: 1,
                  sector: 'Alajuela',
                },
              },
              activity_type: 'Mining',
            },
          ],
        },
        fsm_state: 'submitted',
        next_state: {
          states: ['DCC approved', 'DCC rejected'],
          required_comments: false,
        },
        ppcn_files: [
          { name: '', file: '' },
          { name: '', file: '' },
        ],
        gas_removal: [
          {
            id: '2',
            ppcn: 2,
            removal_cost: '10000',
            removal_cost_currency: 'CRC',
            removal_descriptions: 'Some description',
            total: '10000',
          },
        ],
      },
    ];
    this.ppcnNewFormData = {
      id: '1',
      geographic: [
        {
          id: 1,
          level: 'Regional',
        },
        {
          id: 2,
          level: 'National',
        },
      ],
      required_level: [
        {
          id: 1,
          level: 'Some level',
        },
        {
          id: 2,
          level: 'Some other level',
        },
      ],
      recognition_type: [
        {
          id: 1,
          recognition: 'Some recognition',
        },
        {
          id: 2,
          recognition: 'Other recognition',
        },
      ],
      sector: [
        {
          id: 1,
          sector: 'Guanacaste',
        },
        {
          id: 2,
          sector: 'Alajuela',
        },
      ],
      subSector: [
        {
          id: 1,
          name: 'Liberia',
          sector: {
            id: 1,
            sector: 'Guanacaste',
          },
        },
        {
          id: 2,
          name: 'Nicoya',
          sector: {
            id: 1,
            sector: 'Guanacaste',
          },
        },
      ],
      organization: [
        {
          id: 1,
          name: 'MINAE',
          representative_name: 'Some rep',
          phone_organization: '22334455',
          postal_code: '10311',
          fax: '22334400',
          ciiu: 'Some data',
          address: 'Some address',
          contact: {
            full_name: 'Carl Michael',
            email: 'job@minae.com',
            position: 'Manager',
            phone: '88990066',
          },
        },
      ],
      ovv: [
        {
          name: 'Some ovv',
          email: 'ovv@me.com',
          phone: '40008000',
          id: +Math.random().toString(36).substring(30),
        },
        {
          name: 'Some ovv 2',
          email: 'ovv2@me.com',
          phone: '40228000',
          id: +Math.random().toString(36).substring(30),
        },
      ],
      gei_organization: {
        id: 1,
        activity_type: 'Farming',
        ovv: {
          id: 1,
          email: 'ovv1@minae.com',
          phone: '22440077',
          name: 'Random OVV 1',
        },
        emission_OVV: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
        report_date_start: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
        report_date_end: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
        base_year: '2001',
        gei_activity_types: [
          {
            id: 1,
            sector: {
              id: 1,
              sector: 'Guanacaste',
            },
            sub_sector: {
              id: 1,
              name: 'Liberia',
              sector: {
                id: 1,
                sector: 'Guanacaste',
              },
            },
            activity_type: 'Mining',
          },
          {
            id: 2,
            sector: {
              id: 2,
              sector: 'Alajuela',
            },
            sub_sector: {
              id: 1,
              name: 'San Carlos',
              sector: {
                id: 1,
                sector: 'Alajuela',
              },
            },
            activity_type: 'Farming',
          },
        ],
      },
    };
    this.currentLevelId = of('1');
  }

  submitNewPpcnForm(context: any): Observable<Response> {
    const response = {
      statusCode: 200,
      id: '1',
      message: 'Form submitted correctly',
      geographic: 'local',
    };
    return of(response);
  }

  submitUpdatePpcnForm(
    context: any,
    id: string,
    contactFormId: number,
    geographicFormId: number,

    ovvFormId: number
  ): Observable<Response> {
    const response = {
      statusCode: 200,
      id: '1',
      geographic: '',
      message: 'Form updated correctly',
    };
    return of(response);
  }

  deletePpcn(uuid: string): Observable<{} | Object> {
    const response = {
      statusCode: 200,
      message: 'PPCN deleted correctly',
    };
    return of(response);
  }

  updateCurrentGeographicalLevel(newGeographicalLevelId: string) {
    // this.pccnLevelId.next(newGeographicalLevelId);
  }

  ppcn(lang: string): Observable<Ppcn[]> {
    return of(this.somePpcnRegistries);
  }

  ppcnAll(lang: string): Observable<Ppcn[]> {
    return of(this.somePpcnRegistries);
  }

  reRoutePpcn(lang: string): Observable<Ppcn[]> {
    return of(this.somePpcnRegistries);
  }

  geographicLevel(lang: string): Observable<GeographicLevel[]> {
    return of([
      {
        id: 1,
        level: 'local',
      },
      {
        id: 2,
        level: 'national',
      },
    ]);
  }

  ovvFormData(): Observable<Ovv> {
    return of({
      name: 'Some ovv',
      email: 'ovv@me.com',
      phone: '40008000',
      id: +Math.random().toString(36).substring(30),
    });
  }

  newPpcnFormData(levelId: string, lang: string): Observable<PpcnNewFormData> {
    return of(this.ppcnNewFormData);
  }

  subsectors(sector: string, lang: string): Observable<SubSector[]> {
    const response = [
      {
        id: 1,
        name: 'Liberia',
        sector: {
          id: 1,
          sector: 'Guanacaste',
        },
      },
      {
        id: 2,
        name: 'Nicoya',
        sector: {
          id: 1,
          sector: 'Guanacaste',
        },
      },
    ];
    return of(response);
  }

  getPpcn(uuid: string, lang: string): Observable<Ppcn> {
    return of(this.somePpcnRegistries.find((ppcn) => ppcn.id === uuid));
  }

  submitPpcnNewFile(context: any): Observable<Response> {
    const response = {
      statusCode: 200,
      message: 'Form submitted correctly',
    };
    return of(response);
  }

  ppcnReviews(id: string): Observable<PpcnReview[]> {
    const response = [
      {
        date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
        previous_status: 'In Evaluation',
        current_status: 'Approved',
      },
      {
        date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
        previous_status: 'Submitted',
        current_status: 'DCC examination',
      },
    ];
    return of(response);
  }

  getPpcnReviewStatuses(): Observable<PpcnNewFormData> {
    return of(this.ppcnNewFormData);
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

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }
}
