import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusComponent } from '@app/shared/update-status/update-status.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { I18nService } from '@app/core';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { UpdateStatusService } from './update-status.service';
import { MockUpdateStatusService } from './update-status.service.mock';
import * as _moment from 'moment';

const moment = _moment;

describe('UpdateStatusComponent', () => {
  let component: UpdateStatusComponent;
  let fixture: ComponentFixture<UpdateStatusComponent>;

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
      declarations: [ UpdateStatusComponent, LoaderComponent ],
      providers: [
        { provide: I18nService, useClass: MockI18nService},
        { provide: UpdateStatusService, useClass: MockUpdateStatusService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusComponent);
    component = fixture.componentInstance;
    component.entity =       {
      mitigation: 'Some mitigation 1',
      id: '1',
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
      fsm_state: 'Approved',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
