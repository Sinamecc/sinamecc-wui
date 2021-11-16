import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { InputFileComponent } from '../input-file/input-file.component';
import { ByteFormatPipe } from '../input-file/byte-format.pipe';
import { I18nService } from '@app/i18n';
import { UploadProposalService } from './upload-proposal.service';
import { MockUploadProposalService } from './upload-proposal.service.mock';
import * as _moment from 'moment';
import { UploadProposalComponent } from './upload-proposal.component';

const moment = _moment;

describe('UploadProposalComponent', () => {
  let component: UploadProposalComponent;
  let fixture: ComponentFixture<UploadProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [UploadProposalComponent, LoaderComponent, InputFileComponent, ByteFormatPipe],
      providers: [I18nService, { provide: UploadProposalService, useClass: MockUploadProposalService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProposalComponent);
    component = fixture.componentInstance;
    component.entity = {
      initiative: {
        budget: Math.random(),
        contact: {
          id: '1',
          full_name: 'Random Guy Falkes',
          email: 'randomeemail@me.com',
          job_title: 'Manager',
          phone: '22401070',
        },
        description: 'Some desc',
        entity_responsible: 'Some entity',
        finance: {
          id: Math.random().toString(36).substring(30),
          status: {
            id: Math.random().toString(36).substring(30),
            name: 'Status 1',
          },
          finance_source_type: {
            id: Math.random().toString(36).substring(30),
            name: 'Finance Source Type of Initiative',
          },
          source: 'Some clear source',
        },
        goal: 'Some goal',
        id: Math.random().toString(36).substring(30),
        initiative_type: {
          id: Math.random().toString(36).substring(30),
          initiative_type: 'Some type of initiative',
        },
        objective: 'Some objective',
        status: {
          id: Math.random().toString(36).substring(30),
          status: 'Approved',
        },
        name: 'A good initiative',
      },
      name: 'This is a mitigation action',
      id: '1',
      strategy_name: 'Some Test Strategy',
      purpose: 'Some Test Purpose',
      finance: {
        id: Math.random().toString(36).substring(5),
        status: {
          id: Math.random().toString(36).substring(5),
          name: 'Approved',
        },
        finance_source_type: {
          id: '09',
          name: 'Approved',
        },
        source: 'loan',
      },
      quantitative_purpose: 'Some Test Quantitative Purpose',
      status: {
        id: Math.random().toString(36).substring(5),
        status: 'Approved',
      },
      gas_inventory: '90000',
      geographic_scale: {
        id: +Math.random().toString(36).substring(5),
        name: 'National',
      },
      start_date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
      end_date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
      institution: {
        id: Math.random().toString(36).substring(5),
        name: 'MINAE',
      },
      question_ucc: 'Some test UCC question',
      question_ovv: 'Some test OVV question',
      contact: {
        id: Math.random().toString(36).substring(5),
        full_name: 'Randall Valenciano',
        email: 'rvalenciano@minae.co.cr',
        job_title: 'Industrial Engineer',
        phone: '+50687453311',
      },
      emissions_source: 'Cars, Industry, Home Appliances',
      carbon_sinks: 'Some carbon sinks',
      impact: 'Some impact',
      impact_plan: 'Some Impact Plan',
      calculation_methodology: 'Some Calculation Methdodology',
      is_international: false,
      international_participation: 'No',
      sustainability: 'Some sustainability measure',
      location: {
        id: Math.random().toString(36).substring(5),
        geographical_site: 'Pacayas',
        is_gis_annexed: 'Yes',
      },
      progress_indicator: {
        id: Math.random().toString(36).substring(5),
        name: 'CO2 tons per million of people',
        type: 'quantitative',
        unit: 'Tons',
        start_date: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
      },
      next_state: {
        states: ['dcc-approval'],
        required_comments: false,
      },
      created: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
      updated: moment(new Date(+new Date() - Math.floor(Math.random() * 10000000000))).format('MM/DD/YYYY'),
      fsm_state: 'created',
      files: [
        { name: 'test 1', file: Math.random().toString(36) },
        { name: 'test 2', file: Math.random().toString(36) },
        { name: 'test 3', file: Math.random().toString(36) },
      ],
    };
    component.title = 'SOME TITLE';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
